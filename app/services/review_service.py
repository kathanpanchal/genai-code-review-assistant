from app.llm.reviewer import GeminiReviewer
from app.cache.cache_manager import CacheManager
from app.cache.cache_repository import CacheRepository
from app.cache.cache_metrics import CacheMetrics
from app.github.github_client import GitHubClient
from app.utils.review_formatter import format_review


class ReviewService:

    def __init__(self):

        self.reviewer = GeminiReviewer()

        self.cache_repository = CacheRepository()

        self.github_client = GitHubClient()
    

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

        diff = (
            self.github_client
            .get_pull_request_diff(
                repo_name,
                pr_number
            )
        )

        review = self.review_diff(
            diff
        )

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