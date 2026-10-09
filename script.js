
const result = document.getElementById("result");
const history = document.getElementById("history");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function updateDisplay() {
    result.textContent = expression || "0";
}

function calculate() {
    if (!expression) return;

    // Only allow calculator numbers and operators.
    if (!/^[0-9+\-*/.()\s]+$/.test(expression)) {
        result.textContent = "Invalid input";
        expression = "";
        return;
    }

    try {
        const answer = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(answer)) {
            throw new Error("Invalid calculation");
        }

        history.textContent = expression + " =";
        expression = String(
            Number(answer.toPrecision(12))
        );
        result.textContent = expression;
        finished = true;
    } catch {
        result.textContent = "Error";
        expression = "";
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
        expression = "";
        history.textContent = "";
        finished = false;
        updateDisplay();
        return;
    }

    if (action === "delete") {
        if (finished) {
            expression = "";
            finished = false;
        } else {
            expression = expression.slice(0, -1);
        }
        updateDisplay();
        return;
    }

    if (action === "percent") {
        const match = expression.match(
            /(\d+\.?\d*)$/
        );

        if (match) {
            const number = Number(match[0]) / 100;
            expression = expression.slice(
                0, -match[0].length
            ) + number;
            updateDisplay();
        }
        return;
    }

    if (action === "calculate") {
        calculate();
        return;
    }

    if (value !== undefined) {
        if (finished) {
            if ("+-*/".includes(value)) {
                finished = false;
            } else {
                expression = "";
                history.textContent = "";
                finished = false;
            }
        }

        if (value === ".") {
            const currentNumber = expression.split(/[+\-*/]/).pop();
            if (currentNumber.includes(".")) return;

            if (!currentNumber) {
                expression += "0";
            }
        }

        expression += value;
        updateDisplay();
    }
});

// Allow keyboard input as well.
document.addEventListener("keydown", function (event) {
    if (/^[0-9.]$/.test(event.key)) {
        if (finished) {
            expression = "";
            finished = false;
        }

        if (event.key === ".") {
            const current = expression.split(/[+\-*/]/).pop();
            if (current.includes(".")) return;
        }

        expression += event.key;
        updateDisplay();
    } else if ("+-*/".includes(event.key)) {
        expression += event.key;
        finished = false;
        updateDisplay();
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay();
    } else if (event.key === "Escape") {
        expression = "";
        history.textContent = "";
        updateDisplay();
    }
});