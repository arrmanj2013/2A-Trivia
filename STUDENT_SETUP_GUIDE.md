# AI Trivia Generator - Beginner Guide

This is the simple version to read directly on GitHub from any laptop.

## What you need
- GitHub account
- ChatGPT/Codex access
- Vercel account
- OpenAI API key

## 1) Create the GitHub project
1. Open GitHub.
2. Click **New repository**.
3. Name it **`2A-Trivia`**.
4. Make it **Public**.
5. Click **Create repository**.

## 2) Connect Codex to GitHub
1. Open Codex.
2. Connect your GitHub account.
3. Allow access to your project.
4. Choose **`2A-Trivia`**.

## 3) Prompt to paste into Codex
```text
Build me a complete AI Trivia Generator app.

Requirements:
- Title: AI Trivia Generator
- Topic dropdown with Space, Animals, Technology, Music, Movies, History
- Generate Trivia button
- AI generates 1 question with 4 options
- User clicks an answer and gets immediate feedback
- Correct answer turns green
- Incorrect answers turn red
- Show the correct answer if the user was wrong
- Show a Next Question button
- Keep the UI clean and beginner-friendly
- Make it work locally with npm start
- Make it work on Vercel
- Add .env.example
- Do not commit .env
- Add fallback trivia if OpenAI fails
- Add simple README instructions
- Use:
  - public/ for frontend
  - api/topics.js
  - api/trivia.js
  - lib/trivia.js
