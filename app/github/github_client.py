import os
import requests

from dotenv import load_dotenv
from app.exceptions import GitHubAPIError

load_dotenv()


class GitHubClient:

    REQUEST_TIMEOUT = (5, 30)

    def __init__(self):
        token = os.getenv("GITHUB_TOKEN")

        self.headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json"
        }
    def post_issue_comment(self,repo_name,pr_number,comment_body):

        url = (
            f"https://api.github.com/repos/"
            f"{repo_name}/issues/{pr_number}/comments"
        )

        payload = {
            "body": comment_body
        }

        response = self._request("post", url, json=payload)

        return response.json()
    

    def get_pull_request_diff(
        self,
        repo_name: str,
        pr_number: int
    ) -> str:

        url = (
            f"https://api.github.com/repos/"
            f"{repo_name}/pulls/{pr_number}"
        )

        headers = {
            **self.headers,
            "Accept": "application/vnd.github.diff"
        }

        response = self._request("get", url, headers=headers)

        return response.text
    

    def get_issue_comments(
        self,
        repo_name,
        pr_number
    ):

        url = (
            f"https://api.github.com/repos/"
            f"{repo_name}/issues/{pr_number}/comments"
        )

        response = self._request("get", url)

        return response.json()
    
    def update_issue_comment(
        self,
        repo_name,
        comment_id,
        comment_body
    ):

        url = (
            f"https://api.github.com/repos/"
            f"{repo_name}/issues/comments/{comment_id}"
        )

        payload = {
            "body": comment_body
        }

        response = self._request("patch", url, json=payload)

        return response.json()

    def _request(self, method, url, headers=None, **kwargs):
        try:
            response = requests.request(
                method,
                url,
                headers=headers or self.headers,
                timeout=self.REQUEST_TIMEOUT,
                **kwargs
            )
            response.raise_for_status()
            return response
        except requests.Timeout as exc:
            raise GitHubAPIError(
                "GitHub took too long to respond. Please try again."
            ) from exc
        except requests.HTTPError as exc:
            status_code = exc.response.status_code
            client_status = status_code if status_code in (404, 429) else 502
            raise GitHubAPIError(
                self._friendly_error(status_code),
                status_code=client_status
            ) from exc
        except requests.RequestException as exc:
            raise GitHubAPIError(
                "GitHub is temporarily unavailable. Please try again."
            ) from exc

    @staticmethod
    def _friendly_error(status_code):
        if status_code == 404:
            return "The pull request was not found or the repository is private."
        if status_code in (403, 429):
            return "The GitHub API rate limit may have been reached."
        if status_code in (413, 422):
            return "The pull request diff is too large to analyze."
        return "Unable to fetch the pull request from GitHub."
