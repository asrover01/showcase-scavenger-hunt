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
// HANGMAN WORDS PER QUESTION
// =========================
const hangmanWords = {
  1: "postman pat",
  2: "tickets",
  3: "sweet amber coat",
  4: "ice blast",
  5: "colourless rolls",
  6: "white nectar",
  7: "sugar hoarded electric medicine",
  8: "Genetically Modified Beverage",
  9: "Healers",
  10: "Taps and Barrels",
  11: "purifying elixir",
  12: "humming box",
  13: "The witching hour coffer"
};

// =========================
// HANGMAN ELEMENTS
// =========================
const hangmanOverlay = document.getElementById("hangman-overlay");
const hangmanInput = document.getElementById("hangman-input");
const hangmanSubmit = document.getElementById("hangman-submit");
const hangmanWrong = document.getElementById("hangman-wrong");

let hangmanPhrase = "";
let hangmanHidden = "";
let wrongLetters = [];
let hangmanSolved = false;

// =========================
// ANSWERS
// =========================
const answers = {
  "question-1": "7359",
  "question-2": "4672",
  "question-3": "3549",
  "question-4": "7516",
  "question-5": "5831",
  "question-6": "8359",
  "question-7": "1197",
  "question-8": "5337",
  "question-9": "4588",
  "question-10": "1622",
  "question-11": "3797",
  "question-12": "3347",
  "question-13": "4445"
};

const masterKey = "12388897";

// =========================
// LOAD PROGRESS
// =========================
let masterInput = false;
let currentQuestion = Number(localStorage.getItem("currentQuestion")) || 1;
let finalSolved = localStorage.getItem("finalSolved") === "true";

if (currentQuestion > 13) currentQuestion = 13;

// If returning to final screen and hangman was solved, show revealed phrase
if (currentQuestion === 13 && finalSolved) {
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("question-13").classList.remove("hidden");

  const hintSpan = document.getElementById("q13-hint");
  if (hintSpan) hintSpan.textContent = "d e c a d   c o f f e r";
} else {
  document.getElementById("intro").classList.remove("hidden");
}

// =========================
// START BUTTON
// =========================
masterCodeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startBtn.click();
});

startBtn.addEventListener("click", () => {
  document.getElementById("intro").classList.add("hidden");

  const code = masterCodeInput.value.trim();

  // MASTER CODE JUMP LOGIC
  if (code.startsWith(masterKey)) {
    const jumpTo = Number(code.slice(masterKey.length));

    // No number → jump to final (13)
    if (!jumpTo) {
      sections.forEach(s => s.classList.add("hidden"));
      document.getElementById("question-13").classList.remove("hidden");
      localStorage.setItem("currentQuestion", 13);
      currentQuestion = 13;
      startHangman(13);
      return;
    }

    const targetSection = document.getElementById(`question-${jumpTo}`);

    if (targetSection) {
      sections.forEach(s => s.classList.add("hidden"));
      targetSection.classList.remove("hidden");

      localStorage.setItem("currentQuestion", jumpTo);
      currentQuestion = jumpTo;

      hangmanSolved = false;
      startHangman(jumpTo);
      return;
    }
  }

  // Incorrect master code
  if (code !== "") {
    sections.forEach(s => s.classList.add("hidden"));
    document.getElementById("incorrect-message").classList.remove("hidden");
    masterInput = true;
    return;
  }

  // Normal start
  const savedSection = document.getElementById(`question-${currentQuestion}`);
  if (savedSection) {
    savedSection.classList.remove("hidden");
    startHangman(currentQuestion);
  }
});

// =========================
// QUESTION LOGIC
// =========================
sections.forEach(section => {
  if (section.id === "intro" || section.id === "incorrect-message") return;

  const btn = section.querySelector("button");
  const input = section.querySelector("input");
  if (!btn || !input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
  });

  btn.addEventListener("click", () => {
    const userAnswer = input.value.trim().toLowerCase();

    // Master key inside questions → jump to final
    if (userAnswer === masterKey) {
      sections.forEach(s => s.classList.add("hidden"));
      document.getElementById("question-13").classList.remove("hidden");
      localStorage.setItem("currentQuestion", 13);
      currentQuestion = 13;
      startHangman(13);
      return;
    }

    const correctAnswer = answers[section.id];
    const questionNumber = Number(section.id.split("-")[1]);

    // Must solve hangman first
    if (!hangmanSolved) {
      hangmanOverlay.classList.remove("hidden");
      hangmanWrong.textContent = "Reveal the word first!";
      return;
    }

    if (userAnswer === correctAnswer) {
      section.classList.add("hidden");

      const nextNumber = questionNumber + 1;
      const nextSection = document.getElementById(`question-${nextNumber}`);

      localStorage.setItem("currentQuestion", nextNumber);
      currentQuestion = nextNumber;
      hangmanSolved = false;

      if (nextSection) {
        nextSection.classList.remove("hidden");
        startHangman(nextNumber);
      } else {
        document.getElementById("question-13").classList.remove("hidden");
        startHangman(13);
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

  if (masterInput) {
    document.getElementById("intro").classList.remove("hidden");
    masterInput = false;
    masterCodeInput.value = "";
    return;
  }

  const retrySection = document.getElementById(`question-${currentQuestion}`);
  retrySection.classList.remove("hidden");

  const retryInput = retrySection.querySelector("input");
  retryInput.value = "";
});

// =========================
// CHEAT BUTTON
// =========================
if (cheatBtn) {
  cheatBtn.addEventListener("click", () => {
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("finalSolved");

    sections.forEach(section => section.classList.add("hidden"));
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("question-13").classList.remove("hidden");

    currentQuestion = 13;
    startHangman(13);
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
  localStorage.removeItem("finalSolved");
  currentQuestion = 1;

  sections.forEach(section => section.classList.add("hidden"));
  document.getElementById("intro").classList.remove("hidden");
  masterCodeInput.value = "";
});

// =========================
// HANGMAN FUNCTIONS
// =========================
function revealLetter(phrase, hidden, guess) {
  let result = hidden.split("");
  for (let i = 0; i < phrase.length; i++) {
    if (phrase[i].toLowerCase() === guess.toLowerCase()) {
      result[i] = phrase[i];
    }
  }
  return result.join("");
}

function formatHiddenWord(word) {
  return word
    .split("")
    .map(char => {
      if (char === " ") {
        return "  ";
      } else if (char === "_") {
        return "_";
      } else {
        return char;
      }
    })
    .join(" ");
}

function startHangman(questionNumber) {
  hangmanPhrase = hangmanWords[questionNumber];
  hangmanHidden = hangmanPhrase.replace(/[A-Za-z]/g, "_");
  wrongLetters = [];
  hangmanSolved = false;

  hangmanOverlay.classList.remove("hidden");
  hangmanWrong.textContent = "";
  hangmanInput.value = "";
  hangmanInput.focus();

  const hintSpan = document.getElementById(`q${questionNumber}-hint`);
  if (hintSpan) {
    hintSpan.textContent = formatHiddenWord(hangmanHidden);
  }
}

// =========================
// GUESS LOGIC
// =========================
hangmanInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") hangmanSubmit.click();
});

hangmanSubmit.addEventListener("click", () => {
  const guess = hangmanInput.value.trim().toLowerCase();
  hangmanInput.value = "";
  hangmanInput.focus();

  if (!guess.match(/[a-z]/)) return;

  const hintSpan = document.getElementById(`q${currentQuestion}-hint`);

  if (hangmanPhrase.toLowerCase().includes(guess)) {
    hangmanHidden = revealLetter(hangmanPhrase, hangmanHidden, guess);

    if (hintSpan) {
      hintSpan.textContent = formatHiddenWord(hangmanHidden);
    }
  } else {
    if (!wrongLetters.includes(guess)) {
      wrongLetters.push(guess);
      hangmanWrong.textContent = `Wrong (${wrongLetters.length}/3): ${wrongLetters.join(", ")}`;
    }
  }

  if (hangmanHidden === hangmanPhrase) {
    hangmanSolved = true;
    hangmanWrong.textContent = "Solved!";
    if (currentQuestion === 13) {
      localStorage.setItem("finalSolved", "true");
    }
    setTimeout(() => hangmanOverlay.classList.add("hidden"), 1200);
    return;
  }

  if (wrongLetters.length >= 3) {
    hangmanWrong.textContent = "Out of guesses! Resetting…";
    setTimeout(() => {
      hangmanOverlay.classList.add("hidden");
      startHangman(currentQuestion);
    }, 1200);
  }
});
