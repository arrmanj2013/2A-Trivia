# AI Trivia Generator

A local trivia app that lets you choose a topic, generate a trivia question, answer instantly, and continue to the next question.

## Features

- Topic picker for Space, Animals, Technology, Music, Movies, and History
- AI-generated trivia via the OpenAI API when `OPENAI_API_KEY` is configured
- Automatic local fallback question bank when no API key is present or the API call fails
- Immediate answer feedback with correct answers in green and incorrect answers in red
- `Next Question` flow that resets the UI and fetches a fresh question

## Run locally

```bash
cp .env.example .env
npm run check
npm start

```
Then open:

```text
http://localhost:3000
```
