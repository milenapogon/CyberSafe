const buttons = document.querySelectorAll("[data-module]");
const workspace = document.querySelector("#workspace");
const title = document.querySelector("#module-title");
const description = document.querySelector("#module-description");
const moduleContent = document.querySelector("#module-content");
const backButton = document.querySelector("#back-button");
const modules = document.querySelector(".modules");
const hero = document.querySelector(".hero");

const moduleContentText = {
    password: {
        title: "Password Lab",
        description: "Twórz i analizuj bezpieczne hasła."
    },
    quiz: {
        title: "Security Quiz",
        description: "Sprawdź swoją wiedzę o cyberbezpieczeństwie."
    }
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
            moduleContent.innerHTML =
                "<p>Moduł quizu zostanie wkrótce udostępniony.</p>";
        }
    });
});

// Powrót do menu
backButton.addEventListener("click", () => {
    workspace.hidden = true;
    modules.hidden = false;
    hero.hidden = false;
    moduleContent.innerHTML = "";
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
    "#lowercase, #uppercase, #numbers, #symbols"
);

characterOptions.forEach((option) => {
    option.addEventListener("change", () => {
        const anySelected = [...characterOptions].some(
            (checkbox) => checkbox.checked
        );

        const message = document.querySelector("#password-message");

        if (!anySelected) {
            message.textContent =
                "Wybierz przynajmniej jeden rodzaj znaków.";
        } else {
            message.textContent = "";
        }
    });
});

generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);
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
        [characters[i], characters[j]] =
            [characters[j], characters[i]];
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
        message.textContent =
            "Długość hasła jest za mała dla wybranych kategorii.";
        return;
    }

    if (!globalThis.crypto?.getRandomValues) {
        message.textContent =
            "Przeglądarka nie obsługuje bezpiecznego losowania.";
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
        password.push(
            allCharacters[secureRandomInt(allCharacters.length)]
        );
    }

    password = shuffleCharacters(password).join("");

    document.querySelector("#password-result").value = password;
    message.textContent = "Hasło zostało wygenerowane.";

    analyzePassword(password, groups.join(""));
}

// Analiza wygenerowanego hasła
function analyzePassword(password, characterPool) {
    const entropy = password.length *
        Math.log2(characterPool.length);

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

    entropyResult.textContent =
        `Szacowana entropia: ${entropy.toFixed(1)} bitów`;

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
