import { translations } from "./components/Translations.js";
import { switchLangauge } from "./components/SwitchLanguage.js";

// GAME STATE
let gameOn = false;
let lang = "en";

// DOM ELEMENTS

const subheading = document.getElementById("hangman-subheading");
const instructionsContainer = document.getElementById("instructions-container");
const gameContainer = document.getElementById("game-container");
const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const figureParts = document.querySelectorAll(".figure-part");
const formContainer = document.getElementById("form-container");
const wordsSubmissionForm = document.getElementById("submit-words");
const inputWordsBtn = document.getElementById("input-words-button");
const inputWordsCancelBtn = document.getElementById(
  "input-words-cancel-button"
);
const resetGameBtn = document.getElementById("reset-game-button");
const quitContainer = document.getElementById("quit-container");
const tryAnotherWordBtn = document.getElementById("try-another-word");
const resetGameBtnEnd = document.getElementById("reset-game-button-end");
const toggleLanguage = document.getElementById("toggle-language");

// GAME VARIABLES
let words = ["application", "programming", "interface", "wizzard"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
const correctLetters = [];
const wrongLetters = [];
let wordWithSpaces;

// FUNCTIONS

// Start Game
function startGame() {
  gameOn = true;
  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayWord();
  subheading.style.display = "block";
  instructionsContainer.style.display = "none";
  inputWordsBtn.style.display = "none";
  gameContainer.style.display = "flex";
  quitContainer.style.display = "flex";
  console.log(translations);
}

// show the hidden word
function displayWord() {
  if (gameOn === true) {
    let lettersInSelectedWord = selectedWord.split("");
    lettersInSelectedWord.includes(" ")
      ? (wordWithSpaces = true)
      : (wordWithSpaces = false);

    selectedWord = lettersInSelectedWord
      .map((letter) => {
        return letter === " " ? "➖" : letter;
      })
      .join("");

    let htmlToInsert = selectedWord
      .split("")
      .map((letter) => {
        if (letter === "➖") {
          return `<span class="letter">➖</span>`;
        } else if (correctLetters.includes(letter)) {
          return `<span class="letter">${letter}</span>`;
        } else if (!correctLetters.includes(letter)) {
          return `<span class="letter"> </span>`;
        }
      })
      .join("");
    wordEl.innerHTML = htmlToInsert;

    const innerWord = wordEl.innerText.replace(/\n/g, "");

    if (innerWord === selectedWord) {
      finalMessage.innerText =
        lang === "en"
          ? "Congratulations! You Won 😁"
          : "Comhghairdeachas! Bhuaigh tú 😁";
      setTimeout(() => {
        popup.style.display = "flex";
      }, 500);
    }
  } else {
    return;
  }
}

// Update Wrong Letters
function updateWrongLettersEl() {
  if (gameOn === true) {
    // Display wrong letter
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => {
      return `<span>${letter}</span>`;
    })}
    `;

    // Add hangman parts
    figureParts.forEach((part, index) => {
      const errors = wrongLetters.length;
      if (index < errors) {
        part.style.display = "block";
      } else {
        part.style.display = "none";
      }
    });

    // check if lost
    if (wrongLetters.length === figureParts.length) {
      finalMessage.innerHTML =
        lang === "en"
          ? "Unfortunately, you lost 😢"
          : "Ar an drochuair, chaill tú 😢";
      setTimeout(() => {
        popup.style.display = "flex";
      }, 500);
    }
  } else {
    return;
  }
}

// Show Notification
function showNotification() {
  if (gameOn === true) {
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);
  } else {
    return;
  }
}

// Keydown letter press Eventlistener
window.addEventListener("keydown", (e) => {
  if (gameOn === true) {
    console.log(e.key);
    if (/^[a-zA-ZáéíóúüñçàèìòùâêîôûäëïöüÅå]$/.test(e.key)) {
      let letter = e.key.toLocaleLowerCase();
      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);
          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);
          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  } else {
    return;
  }
});

function playAgain() {
  if (gameOn === true) {
    // Empty the arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
    updateWrongLettersEl();
    popup.style.display = "none";
  } else {
    return;
  }
}

// Restart game and play again
playAgainBtn.addEventListener("click", playAgain);

// GATHERING AND CONFIRMING USER PROVIDED WORDS
// Gathering user words
const userProvidedWords = [];
function onWordsSubmit(e) {
  e.preventDefault();
  let formData = new FormData(e.target);
  let capturedWords = formData.getAll("words");
  if (
    capturedWords.every((word) => {
      return word.trim() === "";
    })
  ) {
    alert(
      `${
        lang === "en"
          ? "Please enter at least one word"
          : "Iontráil focal amháin ar a laghad, le do thoil"
      }`
    );
    return;
  }
  capturedWords.forEach((word) => {
    if (word === "") {
      return;
    }
    let lettersInWord = word.split("");
    // lettersInWord = lettersInWord.map((letter) => {
    //   return letter === " " ? "➖" : letter;
    // });
    word = lettersInWord.join("");
    userProvidedWords.push(
      word.replace(/\s+/g, " ").trim().toLocaleLowerCase()
    );
  });
  words = userProvidedWords;
  wordsSubmissionForm.reset();
  formContainer.style.display = "none";
  startGame();
}

// EVENT LISTENTERS
// Open Words Submission Form
inputWordsBtn.addEventListener("click", () => {
  formContainer.style.display = "flex";
});

// Cancel Words Submission Form
inputWordsCancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  wordsSubmissionForm.reset();
  formContainer.style.display = "none";
});

window.addEventListener("keydown", (e) => {
  if (formContainer.style.display === "flex") {
    if (e.key === "Escape") {
      wordsSubmissionForm.reset();
      formContainer.style.display = "none";
    }
  }
});

// Words Submission Form
wordsSubmissionForm.addEventListener("submit", onWordsSubmit);

// Reset Game Link
resetGameBtn.addEventListener("click", () => {
  gameOn = false;
  window.location.reload();
});

resetGameBtnEnd.addEventListener("click", () => {
  gameOn = false;
  window.location.reload();
});

// Try antother Word Button
tryAnotherWordBtn.addEventListener("click", playAgain);

// Toggle Language
toggleLanguage.addEventListener("click", (e) => {
  lang === "en" ? (lang = "ga") : (lang = "en");
  console.log(lang);
  switchLangauge(lang, translations);
});

displayWord();

// TODO add links at the top which allow to switch between English and Gaeilge - also, figure out the most efficient way of doing this.
