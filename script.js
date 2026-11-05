const $ = id => document.getElementById(id);

const UI = {
  min: $("min"),
  max: $("max"),
  divisor: $("divisor"),
  num1: $("num1"),
  num2: $("num2"),
  result: $("result"),
  count: $("resultCount")
};

const rangeArray = (min, max) =>
  Array.from(
    { length: max - min + 1 },
    (_, i) => min + i
  );

function getRange() {
  const min = Number(UI.min.value);
  const max = Number(UI.max.value);

  if (
    Number.isNaN(min) ||
    Number.isNaN(max) ||
    min < 0 ||
    max < min
  ) {
    throw new Error(
      "Please enter a valid range."
    );
  }

  return { min, max };
}

function render(numbers) {

  UI.count.textContent =
    `${numbers.length} results`;

  if (!numbers.length) {
    UI.result.innerHTML =
      "No results found.";
    return;
  }

  UI.result.innerHTML = `
    <div class="numbers">
      ${numbers
        .map(n => `<span>${n}</span>`)
        .join("")}
    </div>
  `;
}

function showError(message) {
  UI.count.textContent = "0 results";

  UI.result.innerHTML =
    `<div class="error">${message}</div>`;
}

function calculateDivisible() {

  try {

    const { min, max } =
      getRange();

    const divisor =
      Number(UI.divisor.value);

    if (divisor < 1)
      throw new Error(
        "Invalid divisor."
      );

    render(
      rangeArray(min, max)
        .filter(
          n => n % divisor === 0
        )
    );

  } catch (e) {
    showError(e.message);
  }
}

function commonDivisorsRange() {

  try {

    const { min, max } =
      getRange();

    const a =
      Number(UI.num1.value);

    const b =
      Number(UI.num2.value);

    if (a < 1 || b < 1)
      throw new Error(
        "Enter valid numbers."
      );

    render(
      rangeArray(min, max)
      .filter(
        n =>
          n % a === 0 &&
          n % b === 0
      )
    );

  } catch (e) {
    showError(e.message);
  }
}

function isPrime(n) {

  if (n < 2)
    return false;

  for (
    let i = 2;
    i * i <= n;
    i++
  ) {
    if (n % i === 0)
      return false;
  }

  return true;
}

function primeNumbers() {

  try {

    const { min, max } =
      getRange();

    render(
      rangeArray(min, max)
      .filter(isPrime)
    );

  } catch (e) {
    showError(e.message);
  }
}

function squareNumbers() {

  try {

    const { min, max } =
      getRange();

    const result = [];

    for (
      let i = Math.ceil(
        Math.sqrt(min)
      );
      i * i <= max;
      i++
    ) {
      result.push(i * i);
    }

    render(result);

  } catch (e) {
    showError(e.message);
  }
}

function cubeNumbers() {

  try {

    const { min, max } =
      getRange();

    const result = [];

    for (
      let i = Math.ceil(
        Math.cbrt(min)
      );
      i ** 3 <= max;
      i++
    ) {
      result.push(i ** 3);
    }

    render(result);

  } catch (e) {
    showError(e.message);
  }
}

function copyResults() {

  navigator.clipboard.writeText(
    UI.result.innerText
  );
}

function clearAll() {

  document
    .querySelectorAll("input")
    .forEach(
      input => input.value = ""
    );

  UI.count.textContent =
    "0 results";

  UI.result.textContent =
    "Results will appear here.";
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    ["min", "max"].forEach(id => {

      const el = $(id);

      el.value =
        localStorage.getItem(id)
        || "";

      el.addEventListener(
        "input",
        e => {
          localStorage.setItem(
            id,
            e.target.value
          );
        }
      );

    });

  }
);
