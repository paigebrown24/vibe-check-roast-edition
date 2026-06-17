// ============================================================
// VIBE CHECK: THE ROAST EDITION
// script.js — vanilla JS, Supabase counter, Claude API
// ============================================================

// ── CONFIG ──────────────────────────────────────────────────
// 🔑 Paste your Anthropic API key below (for local dev only!)
// Before pushing to GitHub, move this to a backend/Edge Function
const ANTHROPIC_API_KEY = "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";

// 🗄️ Supabase config — replace with your project values
const SUPABASE_URL = "https://yvnkaovpziaheoxowdal.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Nu69dEYovE7cLgR4jgIpTA_Ma-Qs8JO";

// ── QUESTION POOL (15 total, 4 picked randomly each round) ──
const ALL_QUESTIONS = [
  {
    question: "Pick a suspicious vegetable.",
    options: ["Eggplant (it's plotting something)", "Celery (why is it so loud?)", "Beet (it's hiding a secret identity)", "Artichoke (way too many layers)"],
  },
  {
    question: "What's your red flag superpower?",
    options: ["Replying 'lol' to a paragraph", "Googling someone mid-conversation", "Emotional damage via playlist", "Leaving people on read as a love language"],
  },
  {
    question: "Pick a cryptid to be your roommate.",
    options: ["Mothman (chaotic but loyal)", "Bigfoot (quiet, respects boundaries)", "Loch Ness Monster (mysterious, rarely home)", "Chupacabra (messy but fun at parties)"],
  },
  {
    question: "What does your brain sound like at 2am?",
    options: ["A true crime podcast on 1.5x speed", "Elevator music but slightly off-key", "That one embarrassing thing from 2014 on repeat", "A group chat that nobody muted"],
  },
  {
    question: "Pick an object that holds too much power.",
    options: ["A partially charged phone at 3%", "The aux cord at a party", "A read receipt", "The last slice of pizza"],
  },
  {
    question: "What's your emotional support coping mechanism?",
    options: ["Reorganizing something that was already organized", "Adding things to an online cart and never checking out", "Making a playlist instead of processing feelings", "Starting a new hobby, quitting in 4 days"],
  },
  {
    question: "You're a font. Which one?",
    options: ["Comic Sans (misunderstood icon)", "Times New Roman (secretly unhinged)", "Papyrus (main character energy)", "Wingdings (nobody gets you and that's fine)"],
  },
  {
    question: "Pick a nap location that speaks to your soul.",
    options: ["Under a desk", "In a car in a parking lot", "On a pile of clean laundry you'll never fold", "Standing up in the shower"],
  },
  {
    question: "Your villain origin story starts with:",
    options: ["Someone chewing too loud", "A WiFi password that doesn't work", "Being left on read by your crush", "Someone saying 'we need to talk'"],
  },
  {
    question: "Pick an unhinged life skill you've mastered.",
    options: ["Falling asleep anywhere in under 3 minutes", "Eating a full meal over the sink", "Pretending to be busy when you're doing nothing", "Texting back 4 days later like nothing happened"],
  },
  {
    question: "What's your spirit animal doing right now?",
    options: ["Napping aggressively", "Staring at a wall thinking deeply", "Causing a scene at a grocery store", "Ghosting everyone it knows"],
  },
  {
    question: "You're a kitchen appliance. Which one?",
    options: ["A blender with no lid", "A microwave that adds 30 seconds every time", "A toaster that only burns one side", "A fridge that hums at 3am"],
  },
  {
    question: "Pick a way to enter a room.",
    options: ["Like you forgot why you walked in", "Like a final boss", "Like you're already leaving", "Like you own it but owe rent"],
  },
  {
    question: "What's your toxic trait at a group project?",
    options: ["Doing everything yourself then being mad about it", "Disappearing until the last night", "Making the Google Doc pretty instead of writing anything", "Saying 'I'll do whatever' then vetoing everything"],
  },
  {
    question: "You're a weather event. Which one?",
    options: ["A fog that showed up uninvited", "A thunderstorm with great lighting", "A drizzle that won't commit", "A heatwave that peaked too early"],
  },
];

const LOADING_MESSAGES = [
  "Consulting the vibe oracle...",
  "Reading your emotional aura...",
  "Calculating chaos levels...",
  "Generating your vibe title...",
  "Almost done judging you...",
];

// ── STATE ────────────────────────────────────────────────────
let currentQuestions = [];
let currentIndex = 0;
let answers = [];
let loadingInterval = null;
let audioCtx = null;

// ── SUPABASE ─────────────────────────────────────────────────
async function getVibeCount() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/vibe_results?select=id`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Prefer: "count=exact" } }
    );
    const count = res.headers.get("content-range")?.split("/")[1];
    document.getElementById("vibe-count").textContent =
      count ? `${Number(count).toLocaleString()}` : "0";
  } catch (e) {
    document.getElementById("vibe-count").textContent = "a lot of";
  }
}

async function saveVibeResult(result, questionAnswerPairs) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/vibe_results`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        vibe_title: result.vibeTitle,
        vibe_emoji: result.vibeEmoji,
        description: result.description,
        aesthetic: result.aesthetic,
        warning: result.warning,
        answers: questionAnswerPairs,
      }),
    });
  } catch (e) {
    console.warn("Could not save to Supabase:", e);
  }
}

// ── SOUND ────────────────────────────────────────────────────
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playPop() {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}
function playWhoosh() {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.35);
  } catch(e) {}
}
function playReveal() {
  try {
    const ctx = getAudio();
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.5);
    });
  } catch(e) {}
}

// ── STARFIELD ────────────────────────────────────────────────
function initStars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.001;
    stars.forEach(s => {
      const a = 0.2 + 0.8 * Math.abs(Math.sin(t * s.speed * 10 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 200, 255, ${a * 0.7})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createStars(120);
  draw();
  window.addEventListener("resize", () => { resize(); createStars(120); });
}

// ── SCREEN MANAGEMENT ────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ── QUIZ LOGIC ───────────────────────────────────────────────
function pickRandomQuestions() {
  const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function renderQuestion() {
  const q = currentQuestions[currentIndex];
  document.getElementById("q-count").textContent = `${currentIndex + 1} / 4`;
  document.getElementById("progress-fill").style.width = `${(currentIndex / 4) * 100}%`;
  document.getElementById("question-text").textContent = q.question;

  const grid = document.getElementById("options-grid");
  grid.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleAnswer(opt));
    grid.appendChild(btn);
  });

  // fade in
  const quiz = document.querySelector(".quiz-wrap");
  quiz.style.opacity = "0";
  setTimeout(() => { quiz.style.transition = "opacity 0.3s"; quiz.style.opacity = "1"; }, 10);
}

function handleAnswer(answer) {
  playPop();
  answers.push(answer);

  const quiz = document.querySelector(".quiz-wrap");
  quiz.style.opacity = "0";

  setTimeout(() => {
    if (currentIndex < 3) {
      currentIndex++;
      renderQuestion();
    } else {
      showScreen("screen-loading");
      startLoadingMessages();
      fetchVibe();
    }
  }, 300);
}

// ── LOADING MESSAGES ─────────────────────────────────────────
function startLoadingMessages() {
  let i = 0;
  const el = document.getElementById("loading-text");
  el.textContent = LOADING_MESSAGES[0];
  loadingInterval = setInterval(() => {
    i = (i + 1) % LOADING_MESSAGES.length;
    el.style.opacity = "0";
    setTimeout(() => { el.textContent = LOADING_MESSAGES[i]; el.style.opacity = "1"; }, 300);
  }, 1800);
}

// ── CLAUDE API CALL ──────────────────────────────────────────
async function fetchVibe() {
  const questionAnswerPairs = currentQuestions.map((q, i) => ({
    question: q.question,
    answer: answers[i],
  }));

  const prompt = `You are a chaotic, hilarious, slightly unhinged personality quiz generator. Based on these quiz answers, generate a ridiculous "vibe check" result. Be funny, oddly specific, and a little too accurate.

The user answered these questions:
${questionAnswerPairs.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join("\n\n")}

Respond in ONLY valid JSON with no markdown, no backticks, no preamble. Use this exact format:
{
  "vibeTitle": "A 2-5 word chaotic vibe title like 'Delulu CEO Energy' or 'Feral Spreadsheet Goblin' or 'Unhinged Cozy Chaos'",
  "vibeEmoji": "1-3 emojis that match the vibe",
  "description": "A 2-3 sentence funny, oddly specific personality roast based on their answers. Be weirdly accurate and a little too personal. Reference their specific answer choices.",
  "aesthetic": "One sentence describing their aesthetic, like 'Your aesthetic is a haunted library with RGB lighting'",
  "warning": "A funny one-sentence warning label for this person, like 'Warning: will absolutely gaslight you into watching a 3-hour video essay'"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content.map(item => item.type === "text" ? item.text : "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(clean);

    clearInterval(loadingInterval);
    await saveVibeResult(result, questionAnswerPairs);
    await getVibeCount();
    showResult(result);

  } catch (err) {
    console.error(err);
    clearInterval(loadingInterval);
    showResult({
      vibeTitle: "Error 404: Vibe Not Found",
      vibeEmoji: "🫠",
      description: "Your vibe was so powerful it broke the algorithm. That's either impressive or concerning. Probably both.",
      aesthetic: "Your aesthetic is a loading screen that became sentient.",
      warning: "Warning: may cause unexpected errors in social situations.",
    });
  }
}

// ── SHOW RESULT ──────────────────────────────────────────────
function showResult(result) {
  document.getElementById("vibe-emoji").textContent = result.vibeEmoji;
  document.getElementById("vibe-title").textContent = result.vibeTitle;
  document.getElementById("result-description").textContent = result.description;
  document.getElementById("result-aesthetic").textContent = "🎨 " + result.aesthetic;
  document.getElementById("result-warning").textContent = "⚠️ " + result.warning;
  showScreen("screen-result");
  playReveal();
}

// ── RESTART ──────────────────────────────────────────────────
function restart() {
  playPop();
  currentIndex = 0;
  answers = [];
  currentQuestions = pickRandomQuestions();
  renderQuestion();
  showScreen("screen-quiz");
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initStars();
  getVibeCount();

  document.getElementById("start-btn").addEventListener("click", () => {
    playWhoosh();
    currentQuestions = pickRandomQuestions();
    currentIndex = 0;
    answers = [];
    renderQuestion();
    showScreen("screen-quiz");
  });

  document.getElementById("retry-btn").addEventListener("click", restart);
});
