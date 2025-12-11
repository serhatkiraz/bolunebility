// DOM Elements
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');
const divisorInput = document.getElementById('divisor');
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const resultDiv = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultCount = document.getElementById('resultCount');

// Local Storage for inputs
document.addEventListener('DOMContentLoaded', function() {
    const savedMin = localStorage.getItem('divisibility_min');
    const savedMax = localStorage.getItem('divisibility_max');
    if (savedMin) minInput.value = savedMin;
    if (savedMax) maxInput.value = savedMax;
    
    [minInput, maxInput].forEach(input => {
        input.addEventListener('change', function() {
            localStorage.setItem('divisibility_min', minInput.value);
            localStorage.setItem('divisibility_max', maxInput.value);
            clearResult();
        });
    });
    
    // Enter key support
    divisorInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') calculateDivisible();
    });
    
    [num1Input, num2Input].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') commonDivisorsRange();
        });
    });
});

// Validate range inputs
function validateRange() {
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    
    if (isNaN(min) || isNaN(max)) {
        showError('Please enter a valid range.');
        return false;
    }
    
    if (min < 0 || max < 0) {
        showError('Please enter positive numbers.');
        return false;
    }
    
    if (min > max) {
        showError('Start number cannot be greater than end number.');
        return false;
    }
    

    
    return { min, max };
}

// Show error message
function showError(message) {
    resultTitle.textContent = 'Error!';
    resultDiv.innerHTML = `<div class="empty-result" style="color: #ff6b6b;">
        <i class="fas fa-exclamation-triangle"></i><br><br>${message}
    </div>`;
    resultCount.textContent = '0 results';
}

// Clear results
function clearResult() {
    resultTitle.textContent = 'Results';
    resultDiv.innerHTML = `<div class="empty-result">
        <i class="fas fa-search"></i>
        <p>Select an operation and results will appear here.</p>
    </div>`;
    resultCount.textContent = '0 results';
}

// Display results in grid
function displayResults(numbers, title) {
    if (numbers.length === 0) {
        resultDiv.innerHTML = `<div class="empty-result">
            <i class="far fa-folder-open"></i><br><br>
            No <strong>${title.toLowerCase()}</strong> found in the specified range.
        </div>`;
        resultCount.textContent = '0 results';
        return;
    }
    
    resultTitle.textContent = title;
    resultCount.textContent = `${numbers.length} results`;
    
    let numbersHTML = '';
    numbers.forEach(num => {
        numbersHTML += `<div class="number-item">${num}</div>`;
    });
    
    resultDiv.innerHTML = `
        <div class="result-info">
            <strong>Range:</strong> ${minInput.value} - ${maxInput.value}<br>
            <strong>Found ${title.toLowerCase()}:</strong> ${numbers.length} items
        </div>
        <div class="numbers-grid">${numbersHTML}</div>
    `;
}

// List numbers divisible by divisor
function calculateDivisible() {
    const range = validateRange();
    if (!range) return;
    
    const divisor = parseInt(divisorInput.value);
    if (isNaN(divisor) || divisor < 1) {
        showError('Please enter a valid divisor (1 or greater).');
        return;
    }
    
    const { min, max } = range;
    let numbers = [];
    for (let i = min; i <= max; i++) {
        if (i % divisor === 0) numbers.push(i);
    }
    
    displayResults(numbers, `Numbers Divisible by ${divisor}`);
}

// List numbers divisible by both numbers
function commonDivisorsRange() {
    const range = validateRange();
    if (!range) return;
    
    const num1 = parseInt(num1Input.value);
    const num2 = parseInt(num2Input.value);
    if (isNaN(num1) || isNaN(num2) || num1 < 1 || num2 < 1) {
        showError('Please enter two valid divisor numbers (1 or greater).');
        return;
    }
    
    const { min, max } = range;
    let numbers = [];
    for (let i = min; i <= max; i++) {
        if (i % num1 === 0 && i % num2 === 0) numbers.push(i);
    }
    
    displayResults(numbers, `Numbers Divisible by ${num1} and ${num2}`);
}

// Prime numbers
function primeNumbers() {
    const range = validateRange();
    if (!range) return;
    
    const { min, max } = range;
    let primes = [];
    
    function isPrime(num) {
        if (num < 2) return false;
        if (num === 2 || num === 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        
        for (let i = 5; i * i <= num; i += 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }
    
    let start = Math.max(2, min);
    if (start === 2 && min <= 2) primes.push(2);
    if (start % 2 === 0) start++;
    
    for (let i = start; i <= max; i += 2) {
        if (isPrime(i)) primes.push(i);
    }
    
    displayResults(primes, 'Prime Numbers');
}

// Square numbers
function squareNumbers() {
    const range = validateRange();
    if (!range) return;
    
    const { min, max } = range;
    let squares = [];
    let i = 1;
    
    while (true) {
        let s = i * i;
        if (s > max) break;
        if (s >= min) squares.push(s);
        i++;
    }
    
    displayResults(squares, 'Perfect Square Numbers');
}

// Cube numbers
function cubeNumbers() {
    const range = validateRange();
    if (!range) return;
    
    const { min, max } = range;
    let cubes = [];
    let i = 1;
    
    while (true) {
        let c = i * i * i;
        if (c > max) break;
        if (c >= min) cubes.push(c);
        i++;
    }
    
    displayResults(cubes, 'Cube Numbers');
}

// Copy results to clipboard
function copyResults() {
    if (!resultDiv.innerText || resultDiv.innerText.includes('Select an operation')) return;
    
    const resultText = Array.from(document.querySelectorAll('.number-item'))
        .map(item => item.textContent)
        .join(', ');
    
    navigator.clipboard.writeText(resultText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'rgba(76, 175, 80, 0.3)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHtml;
            copyBtn.style.background = '';
        }, 2000);
    });
}

// Reset all inputs and results
function clearAll() {
    minInput.value = '';
    maxInput.value = '';
    divisorInput.value = '';
    num1Input.value = '';
    num2Input.value = '';
    localStorage.removeItem('divisibility_min');
    localStorage.removeItem('divisibility_max');
    clearResult();
}
