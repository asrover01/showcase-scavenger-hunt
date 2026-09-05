const startBtn = document.getElementById("start-btn");
const sections = document.querySelectorAll(".scavenger-hunt-container");

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
  "question-10": "2997"
};

// Load saved progress or default to question 1
let currentQuestion =  Number(localStorage.getItem("currentQuestion")) || 1;

// Always show intro on page load
document.getElementById("intro").classList.remove("hidden");

// When Start is clicked → skip ahead to saved question
startBtn.addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");

  const savedSection = document.getElementById(`question-${currentQuestion}`);

  if (savedSection) {
    savedSection.classList.remove("hidden");
  }
});

// Add listeners for each question
sections.forEach(section => {
  const btn = section.querySelector("button");
  const input = section.querySelector("input");

  if (!btn || !input) return; // skip intro + completion message

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});

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
        document.getElementById("completion-message").classList.remove("hidden");
      }
    } else {
      // Incorrect answer
      section.classList.add("hidden");
      document.getElementById("incorrect-message").classList.remove("hidden");
    }
  });
});

// Retry button → return to the same question
document.getElementById("retry-btn").addEventListener("click", () => {
  document.getElementById("incorrect-message").classList.add("hidden");

  const retrySection = document.getElementById(`question-${currentQuestion}`);
  retrySection.classList.remove("hidden");
});
const cheatBtn = document.getElementById("reset-btn");

cheatBtn.addEventListener("click", () => {
  // Clear saved progress
  localStorage.removeItem("currentQuestion");

  // Hide all sections
  sections.forEach(section => section.classList.add("hidden"));

  // Show completion message instantly
  document.getElementById("completion-message").classList.remove("hidden");

  // Set currentQuestion to 10 so retry doesn't break anything
  currentQuestion = 10;
});
const endResetBtn = document.getElementById("end-reset-btn");

endResetBtn.addEventListener("click", () => {
  // Clear saved progress
  localStorage.removeItem("currentQuestion");

  // Reset question counter
  currentQuestion = 1;

  // Hide all sections
  sections.forEach(section => section.classList.add("hidden"));

  // Show intro again
  document.getElementById("intro").classList.remove("hidden");
});
