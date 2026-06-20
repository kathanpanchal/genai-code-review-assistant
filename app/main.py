import json
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from app.cache.cache_metrics import CacheMetrics
from app.exceptions import ReviewError
from app.github.webhook import router as webhook_router
from app.services.review_service import ReviewService


logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(webhook_router)


class ReviewRequest(BaseModel):
    pr_url: str


review_service = ReviewService()


def error_payload(message, code):
    return {
        "error": {
            "code": code,
            "message": message,
        }
    }


@app.exception_handler(ReviewError)
async def review_error_handler(_request: Request, exc: ReviewError):
    logger.warning("Review request failed: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload(exc.message, exc.code),
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, exc: RequestValidationError):
    logger.warning("Invalid review request: %s", exc)
    return JSONResponse(
        status_code=422,
        content=error_payload("The request is invalid.", "invalid_request"),
    )


@app.exception_handler(Exception)
async def unexpected_error_handler(_request: Request, exc: Exception):
    logger.exception("Unexpected backend error", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content=error_payload(
            "Unable to analyze the pull request right now. Please try again.",
            "internal_error",
        ),
    )


@app.get("/")
def health_check():
    return {"status": "running"}


@app.get("/metrics")
def get_metrics():
    cache_stats = CacheMetrics.get_stats()
    history_stats = review_service.history_repository.get_dashboard_data()
    return {**cache_stats, **history_stats}


@app.post("/review")
def review_pr(request: ReviewRequest):
    repo_name, pr_number = review_service.parse_pr_url(request.pr_url)
    return review_service.analyze_pull_request(repo_name, pr_number)


@app.post("/review/stream")
def review_pr_stream(request: ReviewRequest):
    def stream_review():
        try:
            repo_name, pr_number = review_service.parse_pr_url(request.pr_url)

            def send_progress(step):
                progress_events.append({"type": "progress", "step": step})

            progress_events = []
            send_progress("fetching")
            yield json.dumps(progress_events.pop(0)) + "\n"

            diff = review_service.github_client.get_pull_request_diff(
                repo_name,
                pr_number,
            )

            send_progress("analyzing")
            yield json.dumps(progress_events.pop(0)) + "\n"
            review = review_service.review_diff(diff)

            send_progress("generating")
            yield json.dumps(progress_events.pop(0)) + "\n"
            review_service.history_repository.save_review(
                repo_name,
                pr_number,
                review,
            )
            yield json.dumps({"type": "result", "data": review}) + "\n"
        except ReviewError as exc:
            logger.warning("Streaming review failed: %s", exc, exc_info=True)
            yield json.dumps({
                "type": "error",
                "error": error_payload(exc.message, exc.code)["error"],
            }) + "\n"
        except Exception as exc:
            logger.exception("Unexpected streaming review error", exc_info=exc)
            yield json.dumps({
                "type": "error",
                "error": error_payload(
                    "Unable to analyze the pull request right now. Please try again.",
                    "internal_error",
                )["error"],
            }) + "\n"

    return StreamingResponse(
        stream_review(),
        media_type="application/x-ndjson",
        headers={"X-Accel-Buffering": "no"},
    )
