from app.database.postgres import PostgresDB


class ReviewHistoryRepository:

    def __init__(self):
        self.db = PostgresDB()
        self.connection = self.db.get_connection()
        self._create_table()

    def _create_table(self):
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS review_history (
                    id BIGSERIAL PRIMARY KEY,
                    repo_name VARCHAR(255) NOT NULL,
                    pr_number INTEGER NOT NULL,
                    pr_url TEXT NOT NULL,
                    total_issues INTEGER NOT NULL DEFAULT 0,
                    high_count INTEGER NOT NULL DEFAULT 0,
                    medium_count INTEGER NOT NULL DEFAULT 0,
                    low_count INTEGER NOT NULL DEFAULT 0,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                )
                """
            )
            self.connection.commit()
        except Exception:
            self.connection.rollback()
            raise
        finally:
            cursor.close()

    def save_review(self, repo_name, pr_number, review):
        issues = review.get("issues", [])
        severity_counts = {"high": 0, "medium": 0, "low": 0}

        for issue in issues:
            severity = str(issue.get("severity", "")).lower()
            if severity in severity_counts:
                severity_counts[severity] += 1

        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                INSERT INTO review_history (
                    repo_name,
                    pr_number,
                    pr_url,
                    total_issues,
                    high_count,
                    medium_count,
                    low_count
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    repo_name,
                    pr_number,
                    f"https://github.com/{repo_name}/pull/{pr_number}",
                    len(issues),
                    severity_counts["high"],
                    severity_counts["medium"],
                    severity_counts["low"],
                )
            )
            self.connection.commit()
        except Exception:
            self.connection.rollback()
            raise
        finally:
            cursor.close()

    def get_dashboard_data(self, limit=10):
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                SELECT
                    COUNT(*),
                    COALESCE(SUM(total_issues), 0),
                    COALESCE(SUM(high_count), 0),
                    COALESCE(SUM(medium_count), 0),
                    COALESCE(SUM(low_count), 0)
                FROM review_history
                """
            )
            totals = cursor.fetchone()

            cursor.execute(
                """
                SELECT repo_name, pr_number, pr_url, total_issues, created_at
                FROM review_history
                ORDER BY created_at DESC, id DESC
                LIMIT %s
                """,
                (limit,)
            )
            rows = cursor.fetchall()
        finally:
            cursor.close()

        return {
            "total_reviews": totals[0],
            "total_issues": totals[1],
            "high_count": totals[2],
            "medium_count": totals[3],
            "low_count": totals[4],
            "recent_reviews": [
                {
                    "repo_name": row[0],
                    "pr_number": row[1],
                    "pr_url": row[2],
                    "total_issues": row[3],
                    "created_at": row[4],
                }
                for row in rows
            ],
        }
