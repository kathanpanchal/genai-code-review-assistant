const API_BASE_URL = "/api";

export async function reviewPullRequest(
  prUrl,
  onProgress = () => {}
) {
  const response =
    await fetch(
      `${API_BASE_URL}/review/stream`,
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

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (!response.body) {
    throw new Error("Unable to read the review response.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let review = null;

  while (true) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

    const lines = buffer.split("\n");
    buffer = done ? "" : lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;

      const event = JSON.parse(line);

      if (event.type === "progress") {
        onProgress(event.step);
      } else if (event.type === "result") {
        review = event.data;
      } else if (event.type === "error") {
        throw new Error(event.error?.message || "Unable to analyze the PR.");
      }
    }

    if (done) break;
  }

  if (!review) {
    throw new Error("The review could not be completed.");
  }

  return review;
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

async function getErrorMessage(response) {
  try {
    const payload = await response.json();
    return payload?.error?.message || payload?.detail || "Unable to analyze the PR.";
  } catch {
    return "Unable to analyze the PR. Please try again.";
  }
}
