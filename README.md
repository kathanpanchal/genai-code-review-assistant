# GenAI Code Review Assistant

An AI-powered GitHub Pull Request reviewer that automatically analyzes code changes, generates review feedback using Google Gemini, and posts comments directly on GitHub Pull Requests.

## Features

* Automated Pull Request reviews using Google Gemini
* GitHub Webhook integration
* PostgreSQL-based review caching
* Cache hit/miss metrics
* Pull Request comment updates instead of duplicate comments
* Webhook signature verification
* FastAPI backend
* GitHub API integration

## Architecture

```text
GitHub Pull Request
        |
        v
GitHub Webhook
        |
        v
FastAPI Server
        |
        v
Review Service
        |
        +----------------+
        |                |
        v                v
PostgreSQL Cache    Gemini API
        |                |
        +-------+--------+
                |
                v
      GitHub Review Comment
```

## Tech Stack

### Backend

* FastAPI
* Python

### AI

* Google Gemini 2.5 Flash

### Database

* PostgreSQL

### Integrations

* GitHub Webhooks
* GitHub REST API

### Development Tools

* Ngrok
* Git
* GitHub

## Project Structure

```text
app/
├── cache/
├── database/
├── github/
├── llm/
├── services/
├── utils/
└── main.py

tests/
```

## How It Works

1. A Pull Request is opened or updated.
2. GitHub sends a webhook event to the FastAPI server.
3. The PR diff is fetched from GitHub.
4. A hash of the diff is generated.
5. PostgreSQL cache is checked.
6. If a cached review exists:

   * Return cached review.
7. Otherwise:

   * Send diff to Gemini.
   * Generate review.
   * Store review in PostgreSQL.
8. Post or update the review comment on GitHub.

## API Endpoints

### Health Check

```http
GET /
```

### GitHub Webhook

```http
POST /webhook
```

### Cache Metrics

```http
GET /metrics/cache
```

Example response:

```json
{
  "hits": 10,
  "misses": 3,
  "hit_rate": 76.92
}
```

## Local Setup

### Clone Repository

```bash
git clone https://github.com/kathanpanchal/genai-code-review-assistant.git
cd genai-code-review-assistant
```

### Create Virtual Environment

```bash
python -m venv .venv
```

### Activate Environment

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
GITHUB_TOKEN=your_github_token
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_url
```

### Run Application

```bash
uvicorn app.main:app --reload
```

## Future Improvements

* React Dashboard
* Docker Support
* AWS EC2 Deployment
* Review Analytics
* Multi-Repository Support
* Background Task Queue
* User Authentication
## Live Demo

https://genaireviewer.ddns.net

## Author

Kathan Panchal
