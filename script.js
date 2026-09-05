// =========================
// ELEMENT REFERENCES
// =========================
const startBtn = document.getElementById("start-btn");
const sections = document.querySelectorAll(".scavenger-hunt-container");
const retryBtn = document.getElementById("retry-btn");
const cheatBtn = document.getElementById("cheat-btn");
const endResetBtn = document.getElementById("end-reset-btn");

// =========================
// ANSWERS
// =========================
const answers = {
  "question-1": "4658",
  "question-2": "8742",
  "question-3": "4612",
  "question-4": "1349",
  "question-5": "1005",
  "question-6": "8914",
  "question-7": "6259",
  "question-8": "7315",
  "question-9": "8513",
  "question-10": "2997",
  'master-key': "0197"
};

// =========================
// LOAD PROGRESS
// =========================
let currentQuestion = Number(localStorage.getItem("currentQuestion")) || 1;

// If user already completed the hunt → show question-11
if (currentQuestion > 10) {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("question-11").classList.remove("hidden");
} else {
  // Always show intro on page load
  document.getElementById("intro").classList.remove("hidden");
}

// =========================
// START BUTTON
// =========================
startBtn.addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");

  const savedSection = document.getElementById(`question-${currentQuestion}`);
  if (savedSection) savedSection.classList.remove("hidden");
});

// =========================
// QUESTION LOGIC
// =========================
sections.forEach(section => {
  const btn = section.querySelector("button");
  const input = section.querySelector("input");

  if (!btn || !input) return; // skip intro + question-11 + incorrect message

  // ENTER KEY SUBMITS ANSWER
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
  });

  // SUBMIT BUTTON
  btn.addEventListener("click", () => {
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = answers[section.id];
    const questionNumber = Number(section.id.split("-")[1]);

    if (userAnswer === correctAnswer) {
      // Hide current question
      section.classList.add("hidden");

      // Move to next question
      const nextNumber = questionNumber + 1;
      const nextSection = document.getElementById(`question-${nextNumber}`);

      // Save progress
      localStorage.setItem("currentQuestion", nextNumber);
      currentQuestion = nextNumber;

      if (nextSection) {
        nextSection.classList.remove("hidden");
      } else {
        // Show final screen (question-11)
        document.getElementById("question-11").classList.remove("hidden");
      }
    } else {
      // Incorrect answer
      section.classList.add("hidden");
      document.getElementById("incorrect-message").classList.remove("hidden");
    }
  });
});

// =========================
// RETRY BUTTON
// =========================
retryBtn.addEventListener("click", () => {
  document.getElementById("incorrect-message").classList.add("hidden");

  const retrySection = document.getElementById(`question-${currentQuestion}`);
  retrySection.classList.remove("hidden");
});

// =========================
// CHEAT BUTTON (SKIP TO END)
// =========================
cheatBtn.addEventListener("click", () => {
  localStorage.removeItem("currentQuestion");

  sections.forEach(section => section.classList.add("hidden"));

  document.getElementById("intro").classList.add("hidden");
  document.getElementById("question-11").classList.remove("hidden");

  currentQuestion = 11;
});

// =========================
// END RESET BUTTON
// =========================
endResetBtn.addEventListener("click", () => {
  localStorage.removeItem("currentQuestion");
  currentQuestion = 1;

  sections.forEach(section => section.classList.add("hidden"));

  document.getElementById("intro").classList.remove("hidden");
});
