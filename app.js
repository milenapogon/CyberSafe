const buttons = document.querySelectorAll("[data-module]");
const workspace = document.querySelector("#workspace");
const title = document.querySelector("#module-title");
const description = document.querySelector("#module-description");
const moduleContent = document.querySelector("#module-content");
const backButton = document.querySelector("#back-button");
const modules = document.querySelector(".modules");
const hero = document.querySelector(".hero");
updateStats();
updateHistory();

const moduleContentText = {
  password: {
    title: "Password Lab",
    description: "Twórz i analizuj bezpieczne hasła.",
  },
  quiz: {
    title: "Security Quiz",
    description: "Sprawdź swoją wiedzę o cyberbezpieczeństwie.",
  },
};

// Wyświetlanie wybranego modułu
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedModule = button.dataset.module;
    const content = moduleContentText[selectedModule];

    title.textContent = content.title;
    description.textContent = content.description;

    modules.hidden = true;
    hero.hidden = true;
    workspace.hidden = false;

    if (selectedModule === "password") {
      showPasswordLab();
    } else {
      showQuiz();
    }
  });
});

// Powrót do menu
backButton.addEventListener("click", () => {
  workspace.hidden = true;
  modules.hidden = false;
  hero.hidden = false;
  moduleContent.innerHTML = "";
  updateStats();
});

// Interfejs Password Lab
function showPasswordLab() {
  moduleContent.innerHTML = `
        <div class="password-panel">

            <h3>Generator haseł</h3>
            <p>Ustaw parametry i wygeneruj swoje hasło.</p>

            <div class="password-length">
                <label for="length">
                    Długość hasła: <strong id="length-value">16</strong>
                </label>
                <input type="range" id="length"
                    min="8" max="64" value="16">
            </div>

            <div class="password-settings">
                <label class="password-option">
                    <input type="checkbox" id="lowercase" checked>
                    Małe litery (a-z)
                </label>

                <label class="password-option">
                    <input type="checkbox" id="uppercase" checked>
                    Wielkie litery (A-Z)
                </label>

                <label class="password-option">
                    <input type="checkbox" id="numbers" checked>
                    Cyfry (0-9)
                </label>

                <label class="password-option">
                    <input type="checkbox" id="symbols" checked>
                    Znaki specjalne
                </label>
            </div>

            <div class="password-output">
                <input type="text" id="password-result"
                    placeholder="Twoje hasło pojawi się tutaj"
                    readonly autocomplete="off">

                <button id="copy-password" type="button">
                    Kopiuj
                </button>
            </div>

            <div class="password-actions">
                <button id="generate-password" type="button">
                    Generuj hasło
                </button>
            </div>

            <div class="password-strength">
                <h3>Analiza hasła</h3>
                <p id="strength-label">Brak wygenerowanego hasła</p>

                <div class="strength-track">
                    <div class="strength-fill"
                        id="strength-fill"></div>
                </div>

                <p id="entropy-result"></p>
                <div class="password-feedback"
                    id="password-feedback"></div>
            </div>

            <p class="password-message" id="password-message"
                aria-live="polite"></p>

        </div>
    `;

  const lengthInput = document.querySelector("#length");
  const lengthValue = document.querySelector("#length-value");
  const generateButton = document.querySelector("#generate-password");
  const copyButton = document.querySelector("#copy-password");

  lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
  });

  const characterOptions = document.querySelectorAll(
    "#lowercase, #uppercase, #numbers, #symbols",
  );

  characterOptions.forEach((option) => {
    option.addEventListener("change", () => {
      const anySelected = [...characterOptions].some(
        (checkbox) => checkbox.checked,
      );

      const message = document.querySelector("#password-message");

      if (!anySelected) {
        message.textContent = "Wybierz przynajmniej jeden rodzaj znaków.";
      } else {
        message.textContent = "";
      }
    });
  });

  generateButton.addEventListener("click", generatePassword);
  copyButton.addEventListener("click", copyPassword);
}

// SECURITY QUIZ

const quizQuestions = [
  {
    question: "Co oznacza phishing?",
    answers: [
      "Rodzaj programu antywirusowego",
      "Próbę wyłudzenia danych przez podszywanie się",
      "Metodę szyfrowania plików",
      "Sposób tworzenia kopii zapasowej",
    ],
    correct: 1,
    explanation:
      "Phishing polega na podszywaniu się pod zaufane osoby lub instytucje w celu wyłudzenia danych.",
  },
  {
    question: "Które hasło jest najbezpieczniejsze?",
    answers: ["12345678", "Milena2003", "qwerty123", "R7#mP9!vL2@x"],
    correct: 3,
    explanation:
      "Długie, unikalne hasło zawierające różne rodzaje znaków jest trudniejsze do odgadnięcia.",
  },
  {
    question: "Co należy zrobić po otrzymaniu podejrzanego linku?",
    answers: [
      "Natychmiast go otworzyć",
      "Przesłać go znajomym",
      "Sprawdzić nadawcę i adres strony",
      "Podać swoje dane logowania",
    ],
    correct: 2,
    explanation:
      "Zawsze sprawdzaj nadawcę i adres strony. Nie otwieraj podejrzanych odnośników.",
  },
  {
    question: "Do czego służy uwierzytelnianie dwuskładnikowe (2FA)?",
    answers: [
      "Do przyspieszenia Internetu",
      "Do dodatkowego zabezpieczenia konta",
      "Do usuwania wirusów",
      "Do tworzenia silniejszych haseł",
    ],
    correct: 1,
    explanation:
      "2FA wymaga dodatkowego potwierdzenia tożsamości, oprócz samego hasła.",
  },
  {
    question:
      "Co powinieneś zrobić, jeśli zauważysz nieznane logowanie na swoim koncie?",
    answers: [
      "Zignorować powiadomienie",
      "Usunąć aplikację",
      "Zmienić hasło i zabezpieczyć konto",
      "Udostępnić powiadomienie znajomym",
    ],
    correct: 2,
    explanation:
      "Zmień hasło, wyloguj nieznane sesje i sprawdź ustawienia bezpieczeństwa konta.",
  },
];

function showQuiz() {
  let currentQuestion = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    answered = false;

    const question = quizQuestions[currentQuestion];

    moduleContent.innerHTML = `
            <div class="quiz-panel">

                <div class="quiz-progress">
                    <span>Pytanie ${currentQuestion + 1} z ${quizQuestions.length}</span>
                    <span>Punkty: ${score}</span>
                </div>

                <div class="quiz-progress-track">
                    <div class="quiz-progress-fill"
                        style="width: ${(currentQuestion / quizQuestions.length) * 100}%">
                    </div>
                </div>

                <h3 class="quiz-question">${question.question}</h3>

                <div class="quiz-answers">
                    ${question.answers
                      .map(
                        (answer, index) => `
                        <button class="quiz-answer"
                            data-answer="${index}">
                            ${answer}
                        </button>
                    `,
                      )
                      .join("")}
                </div>

                <div id="quiz-feedback" class="quiz-feedback"
                    aria-live="polite"></div>

                <button id="next-question" hidden>
                    Następne pytanie
                </button>

            </div>
        `;

    const answerButtons = document.querySelectorAll(".quiz-answer");

    answerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (answered) return;

        answered = true;

        const selectedAnswer = Number(button.dataset.answer);
        const correctAnswer = question.correct;
        const feedback = document.querySelector("#quiz-feedback");

        if (selectedAnswer === correctAnswer) {
          score++;
          button.classList.add("correct");
          feedback.textContent = "Poprawna odpowiedź! " + question.explanation;
        } else {
          button.classList.add("incorrect");

          answerButtons[correctAnswer].classList.add("correct");

          feedback.textContent =
            "Niestety, to nie ta odpowiedź. " + question.explanation;
        }

        answerButtons.forEach((answerButton) => {
          answerButton.disabled = true;
        });

        const nextButton = document.querySelector("#next-question");

        nextButton.hidden = false;
        nextButton.textContent =
          currentQuestion === quizQuestions.length - 1
            ? "Zobacz wynik"
            : "Następne pytanie";
      });
    });

    document.querySelector("#next-question").addEventListener("click", () => {
      currentQuestion++;

      if (currentQuestion < quizQuestions.length) {
        renderQuestion();
      } else {
        showQuizResult();
      }
    });
  }

  function showQuizResult() {
    const percentage = (score / quizQuestions.length) * 100;

    // Zapisywanie statystyk quizu
    const stats = JSON.parse(localStorage.getItem("cyberSafeStats")) || {
      completed: 0,
      bestScore: 0,
      lastScore: 0,
    };

    stats.completed++;
    stats.lastScore = percentage;
    stats.bestScore = Math.max(stats.bestScore, percentage);

    // Zapis historii quizów
    const history = JSON.parse(localStorage.getItem("cyberSafeHistory")) || [];

    history.unshift({
      score: score,
      total: quizQuestions.length,
      percentage: percentage,
      date: new Date().toLocaleString("pl-PL"),
    });

    // Zachowujemy maksymalnie 5 ostatnich wyników
    if (history.length > 5) {
      history.pop();
    }

    localStorage.setItem("cyberSafeStats", JSON.stringify(stats));

    localStorage.setItem("cyberSafeHistory", JSON.stringify(history));

    let resultMessage;

    if (score === 5) {
      resultMessage = "Świetnie! Znasz zasady cyberbezpieczeństwa.";
    } else if (score >= 3) {
      resultMessage = "Dobra robota! Masz już solidne podstawy.";
    } else {
      resultMessage = "Warto jeszcze poćwiczyć. Spróbuj ponownie!";
    }

    moduleContent.innerHTML = `
            <div class="quiz-result">
                <h3>Quiz zakończony!</h3>

                <div class="quiz-score">
                    ${score} / ${quizQuestions.length}
                </div>

                <p>Twój wynik: ${percentage}%</p>
                <p>${resultMessage}</p>

                <button id="restart-quiz">
                    Rozwiąż ponownie
                </button>
            </div>
        `;

    document.querySelector("#restart-quiz").addEventListener("click", showQuiz);
  }

  renderQuestion();
}

// Bezstronne losowanie liczby z zakresu 0–max-1
function secureRandomInt(max) {
  const range = 0x100000000;
  const limit = range - (range % max);
  const randomValues = new Uint32Array(1);

  do {
    crypto.getRandomValues(randomValues);
  } while (randomValues[0] >= limit);

  return randomValues[0] % max;
}

// Mieszanie znaków metodą Fishera-Yatesa
function shuffleCharacters(characters) {
  for (let i = characters.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters;
}

// Generowanie hasła
function generatePassword() {
  const length = Number(document.querySelector("#length").value);

  const groups = [];

  if (document.querySelector("#lowercase").checked) {
    groups.push("abcdefghijklmnopqrstuvwxyz");
  }

  if (document.querySelector("#uppercase").checked) {
    groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }

  if (document.querySelector("#numbers").checked) {
    groups.push("0123456789");
  }

  if (document.querySelector("#symbols").checked) {
    groups.push("!@#$%^&*()-_=+?");
  }

  const message = document.querySelector("#password-message");

  if (groups.length === 0) {
    message.textContent = "Wybierz przynajmniej jeden rodzaj znaków.";
    return;
  }

  if (length < groups.length) {
    message.textContent = "Długość hasła jest za mała dla wybranych kategorii.";
    return;
  }

  if (!globalThis.crypto?.getRandomValues) {
    message.textContent = "Przeglądarka nie obsługuje bezpiecznego losowania.";
    return;
  }

  let password = [];

  // Najpierw losujemy po jednym znaku z każdej wybranej grupy
  groups.forEach((group) => {
    password.push(group[secureRandomInt(group.length)]);
  });

  // Pozostałe znaki losujemy z całej dostępnej puli
  const allCharacters = groups.join("");

  while (password.length < length) {
    password.push(allCharacters[secureRandomInt(allCharacters.length)]);
  }

  password = shuffleCharacters(password).join("");

  document.querySelector("#password-result").value = password;
  message.textContent = "Hasło zostało wygenerowane.";

  analyzePassword(password, groups.join(""));
}

// Analiza wygenerowanego hasła
function analyzePassword(password, characterPool) {
  const entropy = password.length * Math.log2(characterPool.length);

  const label = document.querySelector("#strength-label");
  const fill = document.querySelector("#strength-fill");
  const entropyResult = document.querySelector("#entropy-result");
  const feedback = document.querySelector("#password-feedback");

  let strength;
  let percentage;

  if (entropy < 40) {
    strength = "Słabe";
    percentage = 25;
  } else if (entropy < 60) {
    strength = "Umiarkowane";
    percentage = 50;
  } else if (entropy < 80) {
    strength = "Silne";
    percentage = 75;
  } else {
    strength = "Bardzo silne";
    percentage = 100;
  }

  label.textContent = `Ocena hasła: ${strength}`;
  fill.style.width = `${percentage}%`;

  entropyResult.textContent = `Szacowana entropia: ${entropy.toFixed(1)} bitów`;

  feedback.textContent =
    "Analiza opiera się na długości hasła i wielkości " +
    "wybranego zestawu znaków. Nie uwzględnia wszystkich " +
    "możliwych słabości, np. przewidywalnych wzorców.";
}

// Kopiowanie hasła
async function copyPassword() {
  const password = document.querySelector("#password-result").value;
  const message = document.querySelector("#password-message");

  if (!password) {
    message.textContent = "Najpierw wygeneruj hasło.";
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    message.textContent = "Hasło skopiowano do schowka.";
  } catch {
    message.textContent =
      "Nie udało się skopiować hasła. Sprawdź uprawnienia przeglądarki.";
  }
}
// Wyświetlanie statystyk
function updateStats() {
  const stats = JSON.parse(localStorage.getItem("cyberSafeStats")) || {
    completed: 0,
    bestScore: 0,
    lastScore: 0,
  };

  document.querySelector("#completed-quizzes").textContent = stats.completed;

  document.querySelector("#best-score").textContent = `${stats.bestScore}%`;

  document.querySelector("#last-score").textContent =
    stats.completed > 0 ? `${stats.lastScore}%` : "—";
}
// Wyświetlanie historii quizów
function updateHistory() {
  const historyContainer = document.querySelector("#quiz-history");

  const history = JSON.parse(localStorage.getItem("cyberSafeHistory")) || [];

  if (history.length === 0) {
    historyContainer.innerHTML = `
            <p class="history-empty">
                Nie masz jeszcze żadnych ukończonych quizów.
            </p>
        `;
    return;
  }

  historyContainer.innerHTML = history
    .map(
      (item, index) => `
        <div class="history-item">
            <div>
                <strong>Próba ${history.length - index}</strong>
                <p>${item.date}</p>
            </div>

            <div class="history-result">
                <strong>${item.score}/${item.total}</strong>
                <span>${item.percentage}%</span>
            </div>
        </div>
    `,
    )
    .join("");
}
