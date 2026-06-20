from app.llm.reviewer import GeminiReviewer
from app.cache.cache_manager import CacheManager
from app.cache.cache_repository import CacheRepository
from app.cache.cache_metrics import CacheMetrics
from app.github.github_client import GitHubClient
from app.database.review_history_repository import ReviewHistoryRepository
from app.exceptions import InvalidPullRequestURL
from app.utils.review_formatter import format_review
import re


class ReviewService:

    def __init__(self):

        self.reviewer = GeminiReviewer()

        self.cache_repository = CacheRepository()

        self.github_client = GitHubClient()

        self.history_repository = ReviewHistoryRepository()
    

    def parse_pr_url(
        self,
        pr_url
    ):

        match = re.fullmatch(
            r"https://github\.com/([^/]+)/([^/]+)/pull/(\d+)/?",
            pr_url.strip()
        )

        if not match:
            raise InvalidPullRequestURL(
                "Enter a valid public GitHub pull request URL."
            )

        repo_name = f"{match.group(1)}/{match.group(2)}"
        pr_number = int(match.group(3))

        return (
            repo_name,
            pr_number
        )


    def review_diff(
        self,
        diff_text
    ):

        code_hash = CacheManager.generate_hash(
            diff_text
        )

        cached_review = (
            self.cache_repository
            .get_review_by_hash(code_hash)
        )

        if cached_review:

            print("CACHE HIT")

            CacheMetrics.record_hit()

            self.cache_repository.increment_hit_count(
                code_hash
            )

            return cached_review

        print("CACHE MISS")
        CacheMetrics.record_miss()

        review = self.reviewer.review_diff(
            diff_text
        )

        self.cache_repository.save_review(
            code_hash,
            review
        )

        return review

    def review_pull_request(
        self,
        repo_name,
        pr_number
    ):

        review = self.analyze_pull_request(repo_name, pr_number)

        comment = format_review(
            review
        )

        existing_comment = (
            self.find_existing_review_comment(
                repo_name,
                pr_number
            )
        )

        if existing_comment:

            print("Updating existing review comment")

            self.github_client.update_issue_comment(
                repo_name,
                existing_comment["id"],
                comment
            )

        else:

            print("Creating new review comment")

            self.github_client.post_issue_comment(
                repo_name,
                pr_number,
                comment
            )

        return review

    def analyze_pull_request(self, repo_name, pr_number, on_progress=None):
        progress = on_progress or (lambda _step: None)

        progress("fetching")
        diff = self.github_client.get_pull_request_diff(repo_name, pr_number)

        progress("analyzing")
        review = self.review_diff(diff)

        progress("generating")
        self.history_repository.save_review(repo_name, pr_number, review)

        return review


    def find_existing_review_comment(
        self,
        repo_name,
        pr_number
    ):

        comments = (
            self.github_client
            .get_issue_comments(
                repo_name,
                pr_number
            )
        )

        for comment in comments:

            if (
                "<!-- GENAI_REVIEW -->"
                in comment["body"]
            ):
                return comment

        return None
