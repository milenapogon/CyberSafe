
const buttons = document.querySelectorAll("[data-module]");
const workspace = document.querySelector("#workspace");
const title = document.querySelector("#module-title");
const description = document.querySelector("#module-description");
const backButton = document.querySelector("#back-button");
const modules = document.querySelector(".modules");
const hero = document.querySelector(".hero");

const moduleContent = {
    password: {
        title: "Password Lab 🔐",
        description:
            "Tutaj stworzymy generator haseł i analizator ich siły."
    },
    quiz: {
        title: "Security Quiz 🧠",
        description:
            "Tutaj przygotujemy pytania, punktację i podsumowanie wyniku."
    }
};

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedModule = moduleContent[button.dataset.module];

        title.textContent = selectedModule.title;
        description.textContent = selectedModule.description;

        modules.hidden = true;
        hero.hidden = true;
        workspace.hidden = false;
    });
});

backButton.addEventListener("click", () => {
    workspace.hidden = true;
    modules.hidden = false;
    hero.hidden = false;
});
