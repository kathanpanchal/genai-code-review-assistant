import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.llm.base_reviewer import BaseReviewer
from app.exceptions import GeminiAPIError

load_dotenv()


class GeminiReviewer(BaseReviewer):

    def __init__(self):
        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY"),
            http_options=types.HttpOptions(timeout=60000)
        )

    def clean_json_response(self, text):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        return text.strip()

    def review_diff(self, diff_text):

        prompt = f"""
        Review this GitHub Pull Request diff.

        Return ONLY valid JSON.

        Schema:

        {{
        "issues": [
            {{
            "severity": "low|medium|high",
            "category": "bug|security|performance|maintainability",
            "file": "filename.py",
            "comment": "review comment"
            }}
        ]
        }}

        Code Diff:

        {diff_text}
        """

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt
            )

            cleaned = self.clean_json_response(response.text or "")
            review = json.loads(cleaned)

            if not isinstance(review.get("issues"), list):
                raise ValueError("Gemini response does not contain an issues list")

            return review
        except (json.JSONDecodeError, AttributeError, ValueError) as exc:
            raise GeminiAPIError(
                "Gemini returned an invalid review. Please try again."
            ) from exc
        except Exception as exc:
            raise GeminiAPIError(
                "Gemini is temporarily unable to analyze this pull request."
            ) from exc
