const $ = id => document.getElementById(id);

const UI = {
  min: $("min"),
  max: $("max"),
  divisor: $("divisor"),
  num1: $("num1"),
  num2: $("num2"),
  result: $("result"),
  count: $("resultCount"),
  loading: $("loading"),
  progress: $("progress")
};

function buttons() {
  return document.querySelectorAll("button");
}

function setBusy(state) {

  buttons().forEach(btn => {
    if (btn.id !== "resetBtn")
      btn.disabled = state;
  });

  if (state) {

    UI.loading.classList.add("active");
    UI.progress.classList.add("active");

  } else {

    UI.loading.classList.remove("active");
    UI.progress.classList.remove("active");
    UI.progress.textContent = "0%";

  }
}

function updateProgress(current, total) {

  if (total <= 0n) {
    UI.progress.textContent = "0%";
    return;
  }

  const percent = Number(
    current * 100n / total
  );

  UI.progress.textContent =
    `${percent}%`;
}

function toBigInt(value) {

  const str = value.trim();

  if (!str)
    throw new Error("Number required");

  if (!/^-?\d+$/.test(str))
    throw new Error("Integers only");

  return BigInt(str);
}

function getRange() {

  const min =
    toBigInt(UI.min.value);

  const max =
    toBigInt(UI.max.value);

  if (min > max)
    throw new Error(
      "Start must be smaller than end."
    );

  return { min, max };
}

function showError(message) {

  UI.count.textContent =
    "0 results";

  UI.result.innerHTML =
    `<div class="error">${message}</div>`;
}

function render(list) {

  UI.count.textContent =
    `${list.length} results`;

  if (!list.length) {

    UI.result.textContent =
      "No results found.";

    return;
  }

  UI.result.innerHTML = `
  <div class="numbers">
    ${
      list.map(n =>
        `<span>${n.toString()}</span>`
      ).join("")
    }
  </div>
  `;
}

function bigintSqrt(n) {

  if (n < 0n)
    throw new Error(
      "Negative square root unsupported."
    );

  if (n < 2n)
    return n;

  let x = n;
  let y = (x + 1n) >> 1n;

  while (y < x) {

    x = y;

    y =
      (x + n / x) >> 1n;

  }

  return x;
}

function bigintCbrt(n) {

  if (n === 0n)
    return 0n;

  const negative =
    n < 0n;

  if (negative)
    n = -n;

  let low = 0n;
  let high = n;

  while (low <= high) {

    const mid =
      (low + high) >> 1n;

    const cube =
      mid * mid * mid;

    if (cube === n)
      return negative
        ? -mid
        : mid;

    if (cube < n)
      low = mid + 1n;
    else
      high = mid - 1n;
  }

  return negative
    ? -high
    : high;
}

function isPrime(n) {

  if (n < 2n)
    return false;

  if (n === 2n)
    return true;

  if (n === 3n)
    return true;

  if (n % 2n === 0n)
    return false;

  if (n % 3n === 0n)
    return false;

  for (
    let i = 5n;
    i * i <= n;
    i += 6n
  ) {

    if (
      n % i === 0n ||
      n % (i + 2n) === 0n
    ) {
      return false;
    }

  }

  return true;
}

async function calculateDivisible() {

  try {

    setBusy(true);

    await new Promise(
      r => setTimeout(r, 10)
    );

    const { min, max } =
      getRange();

    const divisor =
      toBigInt(
        UI.divisor.value
      );

    const total =
      max - min + 1n;

    const result = [];

    let step = 0n;

    for (
      let i = min;
      i <= max;
      i += 1n
    ) {

      step++;

      if (
        i % divisor === 0n
      ) {
        result.push(i);
      }

      if (
        step % 1000n === 0n
      ) {

        updateProgress(
          step,
          total
        );

        await new Promise(
          r => setTimeout(r, 0)
        );

      }

    }

    render(result);

  } catch (e) {

    showError(e.message);

  } finally {

    setBusy(false);

  }
}

async function commonDivisorsRange() {

  try {

    setBusy(true);

    await new Promise(
      r => setTimeout(r, 10)
    );

    const { min, max } =
      getRange();

    const a =
      toBigInt(
        UI.num1.value
      );

    const b =
      toBigInt(
        UI.num2.value
      );

    const total =
      max - min + 1n;

    const result = [];

    let step = 0n;

    for (
      let i = min;
      i <= max;
      i += 1n
    ) {

      step++;

      if (
        i % a === 0n &&
        i % b === 0n
      ) {
        result.push(i);
      }

      if (
        step % 1000n === 0n
      ) {

        updateProgress(
          step,
          total
        );

        await new Promise(
          r => setTimeout(r, 0)
        );

      }

    }

    render(result);

  } catch (e) {

    showError(e.message);

  } finally {

    setBusy(false);

  }
}

async function primeNumbers() {

  try {

    setBusy(true);

    await new Promise(
      r => setTimeout(r, 10)
    );

    const { min, max } =
      getRange();

    const total =
      max - min + 1n;

    const result = [];

    let step = 0n;

    for (
      let i = min;
      i <= max;
      i += 1n
    ) {

      step++;

      if (
        isPrime(i)
      ) {
        result.push(i);
      }

      if (
        step % 100n === 0n
      ) {

        updateProgress(
          step,
          total
        );

        await new Promise(
          r => setTimeout(r, 0)
        );

      }

    }

    render(result);

  } catch (e) {

    showError(e.message);

  } finally {

    setBusy(false);

  }
}

async function squareNumbers() {

  try {

    setBusy(true);

    await new Promise(
      r => setTimeout(r, 10)
    );

    const { min, max } =
      getRange();

    const result = [];

    let i =
      bigintSqrt(min);

    if (
      i * i < min
    ) {
      i += 1n;
    }

    let count = 0n;

    while (
      i * i <= max
    ) {

      result.push(
        i * i
      );

      i += 1n;
      count++;

      if (
        count % 1000n === 0n
      ) {

        UI.progress.textContent =
          `${count}`;

        await new Promise(
          r => setTimeout(r, 0)
        );

      }

    }

    render(result);

  } catch (e) {

    showError(e.message);

  } finally {

    setBusy(false);

  }
}

async function cubeNumbers() {

  try {

    setBusy(true);

    await new Promise(
      r => setTimeout(r, 10)
    );

    const { min, max } =
      getRange();

    const result = [];

    let i =
      bigintCbrt(min);

    while (
      i * i * i < min
    ) {
      i += 1n;
    }

    let count = 0n;

    while (
      i * i * i <= max
    ) {

      result.push(
        i * i * i
      );

      i += 1n;
      count++;

      if (
        count % 1000n === 0n
      ) {

        UI.progress.textContent =
          `${count}`;

        await new Promise(
          r => setTimeout(r, 0)
        );

      }

    }

    render(result);

  } catch (e) {

    showError(e.message);

  } finally {

    setBusy(false);

  }
}

async function copyResults() {

  const text =
    UI.result.innerText.trim();

  if (!text)
    return;

  try {

    await navigator.clipboard
      .writeText(text);

  } catch {

    showError(
      "Copy failed."
    );

  }
}

function clearAll() {

  document
    .querySelectorAll("input")
    .forEach(input => {
      input.value = "";
    });

  localStorage.clear();

  UI.count.textContent =
    "0 results";

  UI.result.textContent =
    "Results will appear here.";

  UI.progress.textContent =
    "0%";
}

document
  .querySelectorAll("input")
  .forEach(input => {

    input.addEventListener(
      "input",
      e => {

        localStorage.setItem(
          e.target.id,
          e.target.value
        );

      }
    );

  });

window.addEventListener(
  "DOMContentLoaded",
  () => {

    document
      .querySelectorAll("input")
      .forEach(input => {

        input.value =
          localStorage.getItem(
            input.id
          ) || "";

      });

  }
);
