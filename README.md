# 🔮 Vibe Check: The Roast Edition

> Answer 4 unhinged questions. Receive a vibe you didn't ask for.

🔗 **Live Site:** [paigebrown24.github.io/vibe-check-roast-edition](https://paigebrown24.github.io/vibe-check-roast-edition/)

---

## What Is This?

Vibe Check: The Roast Edition is an AI-powered personality quiz that generates a completely unique, chaotic personality roast based on your answers to 4 random unhinged questions. Every round pulls from a pool of 15 questions, so no two games are the same.

Each result includes:
- A ridiculous **vibe title** (e.g. "Cryptid With Abandonment Issues")
- A **personality roast** that's oddly too accurate
- Your **aesthetic** described in one devastating sentence
- A **warning label** for anyone who has to deal with you

---

## Features

- 🎲 **Randomized questions** — 4 pulled from a pool of 15 each round
- 🤖 **AI-generated roasts** — powered by the Claude API (Anthropic)
- 🔢 **Live vibe counter** — tracks total vibes checked via Supabase
- 🔊 **Sound effects** — built with Web Audio API (no audio files needed)
- ✨ **Animated starfield** — because vibes need ambiance
- 📱 **Responsive design** — works on mobile and desktop

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| HTML, CSS, JavaScript | Frontend (vanilla — no frameworks) |
| Claude API (Anthropic) | AI vibe generation |
| Supabase | Database for storing results + counter |
| GitHub Pages | Hosting |
| Web Audio API | Sound effects |
| Google Fonts | Dela Gothic One + DM Sans |

---

## How It Works

1. User lands on the intro screen and clicks **Check My Vibe**
2. 4 questions are randomly selected from a pool of 15
3. User answers one question at a time
4. Answers are sent to the Claude API with a prompt that instructs it to generate a chaotic personality roast in JSON format
5. The result is saved to a Supabase database and displayed as a styled card
6. The vibe counter on the intro screen updates in real time

---

## Project Structure

```
vibe-check-roast-edition/
├── index.html      # App structure and all screens
├── style.css       # Cosmic dark purple theme, animations
├── script.js       # Quiz logic, API calls, Supabase integration
└── README.md
```

---

## What I Learned

- How to integrate the Anthropic Claude API into a vanilla JS project
- How to prompt an AI model to return structured JSON data
- How to use Supabase as a lightweight database for a frontend-only project
- How to generate sound effects with the Web Audio API (no files needed!)
- How to build and ship a project from scratch in a weekend hackathon

---

## Built By

**Paige Brown** — Virtual Assistant & Web Developer  
Built during the Persevere Cohort 3 Weekend Hackathon (June 2026)  
[Clear Desk Solutions](https://paigebrown24.github.io/clear-desk-solutions/index.html) | [GitHub](https://github.com/paigebrown24)

---

*No vibes were harmed in the making of this project. Some egos may have been.*
