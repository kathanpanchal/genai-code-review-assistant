const API_BASE_URL = "/api";

export async function reviewPullRequest(
  prUrl
) {
  const response =
    await fetch(
      `${API_BASE_URL}/review`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          pr_url: prUrl
        })
      }
    );

  return response.json();
}

export async function getMetrics() {
  const response =
    await fetch(
      `${API_BASE_URL}/metrics`
    );

  if (!response.ok) {
    throw new Error(
      "Unable to load dashboard metrics."
    );
  }

  return response.json();
}
