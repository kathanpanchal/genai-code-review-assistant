class ReviewError(Exception):
    """Base class for errors that are safe to translate for API clients."""

    status_code = 500
    code = "review_error"

    def __init__(self, message):
        super().__init__(message)
        self.message = message


class InvalidPullRequestURL(ReviewError):
    status_code = 400
    code = "invalid_pr_url"


class GitHubAPIError(ReviewError):
    status_code = 502
    code = "github_api_error"

    def __init__(self, message, status_code=None):
        super().__init__(message)
        if status_code is not None:
            self.status_code = status_code


class GeminiAPIError(ReviewError):
    status_code = 502
    code = "gemini_api_error"

