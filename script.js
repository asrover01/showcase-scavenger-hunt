// =========================
// ELEMENT REFERENCES
// =========================
const startBtn = document.getElementById("start-btn");
const sections = document.querySelectorAll(".scavenger-hunt-container");
const retryBtn = document.getElementById("retry-btn");
const cheatBtn = document.getElementById("cheat-btn");
const endResetBtn = document.getElementById("end-reset-btn");
const masterCodeInput = document.getElementById("master-code");
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
};
const masterKey = "0197"; // Master key to skip to the end
// =========================
// LOAD PROGRESS
// =========================
let masterInput= false;
let currentQuestion = Number(localStorage.getItem("currentQuestion")) || 1;

// If user already completed the hunt → show question-11
if (currentQuestion > 10) {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("question-11").classList.remove("hidden");
} else {
  document.getElementById("intro").classList.remove("hidden");
}

// =========================
// START BUTTON
// =========================
 masterCodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startBtn.click();
  });
  
        ;
      

startBtn.addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");

  // MASTER KEY CHECK
  if (masterCodeInput.value.trim() === masterKey ) {
    document.getElementById("question-11").classList.remove("hidden");
    localStorage.setItem("currentQuestion", 11);
    currentQuestion = 11;
    document.getElementById("incorrect-message").classList.add("hidden");
    return; // ⭐ THIS FIXES THE ISSUE
  }else if (masterCodeInput.value.trim() !== "") {
      sections.forEach(s => s.classList.add("hidden"));
      document.getElementById("incorrect-message").classList.remove("hidden");
      masterInput = true;
      return
    }

  // NORMAL START FLOW
  const savedSection = document.getElementById(`question-${currentQuestion}`);
  if (savedSection) {
    savedSection.classList.remove("hidden");

    const firstInput = savedSection.querySelector("input");
    
  }
});


// =========================
// QUESTION LOGIC
// =========================
sections.forEach(section => {

  // Skip intro, incorrect-message, and final screen
  if (section.id === "intro" || section.id === "incorrect-message" || section.id === "question-11") {
    return;
  }

  const btn = section.querySelector("button");
  const input = section.querySelector("input");

  if (!btn || !input) return;

  // ENTER KEY SUBMITS ANSWER
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
  });

  btn.addEventListener("click", () => {
    const userAnswer = input.value.trim().toLowerCase();

    // MASTER KEY OVERRIDE
    if (userAnswer === masterKey) {
      sections.forEach(s => s.classList.add("hidden"));
      document.getElementById("question-11").classList.remove("hidden");
      localStorage.setItem("currentQuestion", 11);
      currentQuestion = 11;
      return;
    }

    const correctAnswer = answers[section.id];
    const questionNumber = Number(section.id.split("-")[1]);

    if (userAnswer === correctAnswer) {
      section.classList.add("hidden");

      const nextNumber = questionNumber + 1;
      const nextSection = document.getElementById(`question-${nextNumber}`);

      localStorage.setItem("currentQuestion", nextNumber);
      currentQuestion = nextNumber;

      if (nextSection) {
        nextSection.classList.remove("hidden");

        const nextInput = nextSection.querySelector("input");
       
      } else {
        document.getElementById("question-11").classList.remove("hidden");
      }
    } else {
      section.classList.add("hidden");
      document.getElementById("incorrect-message").classList.remove("hidden");
    }
  });
});

// =========================
// RETRY BUTTON
// =========================
retryBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") retryBtn.click();
  });
  
retryBtn.addEventListener("click", () => {
  document.getElementById("incorrect-message").classList.add("hidden");
  if (masterInput){
    document.getElementById("intro").classList.remove("hidden");
    masterInput = false;
    masterCodeInput.value = "";
    return;

  }
  const retrySection = document.getElementById(`question-${currentQuestion}`);
  retrySection.classList.remove("hidden");

  const retryInput = retrySection.querySelector("input");
  retryInput.value = ""; // Clear previous input
 
});

// =========================
// CHEAT BUTTON (SKIP TO END)
// =========================
if (cheatBtn) {
  cheatBtn.addEventListener("click", () => {
    localStorage.removeItem("currentQuestion");

    sections.forEach(section => section.classList.add("hidden"));

    document.getElementById("intro").classList.add("hidden");
    document.getElementById("question-11").classList.remove("hidden");

    currentQuestion = 11;
  });
}

// =========================
// END RESET BUTTON
// =========================
endResetBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter") endResetBtn.click();
  });
  
endResetBtn.addEventListener("click", () => {
  localStorage.removeItem("currentQuestion");
  currentQuestion = 1;

  sections.forEach(section => section.classList.add("hidden"));

  document.getElementById("intro").classList.remove("hidden");
  masterCodeInput.value = "";
  
});
