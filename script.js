
const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
let currentTheme = localStorage.getItem("calcTheme") || "dark";

// -------------------------
// Calculator functions
// -------------------------
function appendValue(value) {
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    if (display.value.trim() === "") return;

    const expression = display.value;
    const result = eval(expression);

    if (result === undefined || Number.isNaN(result)) {
      display.value = "Error";
      return;
    }

    display.value = result;
    addToHistory(expression, result);
  } catch (error) {
    display.value = "Error";
  }
}

// -------------------------
// History functions
// -------------------------
function addToHistory(expression, result) {
  history.unshift(`${expression} = ${result}`);

  if (history.length > 10) {
    history.pop();
  }

  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No calculations yet.";
    historyList.appendChild(emptyItem);
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
}

// -------------------------
// Theme functions
// -------------------------
function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("light");
    themeToggle.textContent = "🌙";
  }

  localStorage.setItem("calcTheme", theme);
}

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
});

// -------------------------
// Keyboard support
// -------------------------
document.addEventListener("keydown", function (e) {
  const allowedKeys = "0123456789+-*/.%";

  if (allowedKeys.includes(e.key)) {
    appendValue(e.key);
  } else if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    deleteLast();
  } else if (e.key === "Escape") {
    clearDisplay();
  }
});

// -------------------------
// Initial load
// -------------------------
applyTheme(currentTheme);
renderHistory();