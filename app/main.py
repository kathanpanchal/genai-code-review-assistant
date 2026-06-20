from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from app.github.webhook import router as webhook_router
from app.cache.cache_metrics import CacheMetrics

from pydantic import BaseModel
from app.services.review_service import ReviewService



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(webhook_router)

@app.get("/")
def health_check():
    return {"status": "running"}

@app.get("/metrics")
def get_metrics():
    return CacheMetrics.get_stats()


class ReviewRequest(BaseModel):
    pr_url: str
    def parse_pr_url(
    self,
    pr_url
    ):

        parts = (
            pr_url
            .replace(
                "https://github.com/",
                ""
            )
            .split("/")
        )

        repo_name = (
            f"{parts[0]}/{parts[1]}"
        )

        pr_number = int(parts[3])

        return (
            repo_name,
            pr_number
        )


review_service = ReviewService()
@app.post("/review")
def review_pr(request: ReviewRequest):

    repo_name, pr_number = (
        review_service.parse_pr_url(
            request.pr_url
        )
    )

    diff = (
        review_service.github_client
        .get_pull_request_diff(
            repo_name,
            pr_number
        )
    )

    review = review_service.review_diff(
        diff
    )

    return review