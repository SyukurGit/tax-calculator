// Tax Calculator Application
// Progressive tax brackets for modern standard deduction models
const taxBrackets = {
    single: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182050, rate: 0.24 },
        { min: 182050, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: Infinity, rate: 0.37 }
    ],
    married: [
        { min: 0, max: 22000, rate: 0.10 },
        { min: 22000, max: 89450, rate: 0.12 },
        { min: 89450, max: 190750, rate: 0.22 },
        { min: 190750, max: 364200, rate: 0.24 },
        { min: 364200, max: 462500, rate: 0.32 },
        { min: 462500, max: 693750, rate: 0.35 },
        { min: 693750, max: Infinity, rate: 0.37 }
    ],
    head: [
        { min: 0, max: 15700, rate: 0.10 },
        { min: 15700, max: 59850, rate: 0.12 },
        { min: 59850, max: 95350, rate: 0.22 },
        { min: 95350, max: 182100, rate: 0.24 },
        { min: 182100, max: 231250, rate: 0.32 },
        { min: 231250, max: 578100, rate: 0.35 },
        { min: 578100, max: Infinity, rate: 0.37 }
    ]
};

/**
 * Calculate tax based on progressive tax brackets
 * @param {number} taxableIncome - The taxable income after deductions
 * @param {string} filingStatus - The filing status (single, married, head)
 * @returns {number} - The total tax amount
 */
function calculateTaxByBracket(taxableIncome, filingStatus) {
    if (taxableIncome <= 0) return 0;
    const brackets = taxBrackets[filingStatus] || taxBrackets.single;
    let totalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;

        const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
        totalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
    }

    return totalTax;
}

/**
 * Calculate the complete tax breakdown
 * @param {number} income - Gross annual income
 * @param {number} deductions - Total deductions
 * @param {string} filingStatus - Filing status (single, married, head)
 * @returns {object} - Tax calculation results
 */
function calculateTaxBreakdown(income, deductions, filingStatus) {
    const grossIncome = Math.max(0, Number(income) || 0);
    const validDeductions = Math.max(0, Number(deductions) || 0);
    const taxableIncome = Math.max(0, grossIncome - validDeductions);
    const totalTax = calculateTaxByBracket(taxableIncome, filingStatus);
    const effectiveTaxRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
    const netIncome = grossIncome - totalTax;

    return {
        grossIncome: grossIncome,
        deductions: validDeductions,
        taxableIncome: taxableIncome,
        effectiveTaxRate: effectiveTaxRate,
        totalTax: totalTax,
        netIncome: netIncome
    };
}

/**
 * Format currency value ($X,XXX.XX)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * Format percentage value (XX.XX%)
 * @param {number} value - The percentage value
 * @returns {string} - Formatted percentage string
 */
function formatPercentage(value) {
    const num = Number(value) || 0;
    return num.toFixed(2) + '%';
}

/**
 * Validate input fields in DOM
 * @returns {boolean} - True if inputs are valid
 */
function validateInputs() {
    const incomeInput = document.getElementById('income');
    const deductionsInput = document.getElementById('deductions');
    const incomeError = document.getElementById('incomeError');
    const deductionsError = document.getElementById('deductionsError');

    if (!incomeInput) return false;

    const income = parseFloat(incomeInput.value);
    const deductions = deductionsInput ? parseFloat(deductionsInput.value) : 0;

    let isValid = true;

    if (isNaN(income) || income < 0) {
        if (incomeError) incomeError.classList.add('show');
        isValid = false;
    } else {
        if (incomeError) incomeError.classList.remove('show');
    }

    if (isNaN(deductions) || deductions < 0) {
        if (deductionsError) deductionsError.classList.add('show');
        isValid = false;
    } else {
        if (deductionsError) deductionsError.classList.remove('show');
    }

    return isValid;
}

/**
 * Main DOM controller to calculate and render tax results
 */
function calculateTax() {
    if (!validateInputs()) {
        return;
    }

    const income = parseFloat(document.getElementById('income').value);
    const deductions = parseFloat(document.getElementById('deductions').value) || 0;
    const filingStatus = document.getElementById('filingStatus').value;

    const result = calculateTaxBreakdown(income, deductions, filingStatus);

    document.getElementById('grossIncome').textContent = formatCurrency(result.grossIncome);
    document.getElementById('deductionsAmount').textContent = formatCurrency(result.deductions);
    document.getElementById('taxableIncome').textContent = formatCurrency(result.taxableIncome);
    document.getElementById('taxRate').textContent = formatPercentage(result.effectiveTaxRate);
    document.getElementById('totalTax').textContent = formatCurrency(result.totalTax);
    document.getElementById('netIncome').textContent = formatCurrency(result.netIncome);

    document.getElementById('result').classList.add('show');
}

// Export for Node.js / Jasmine tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        taxBrackets,
        calculateTaxByBracket,
        calculateTaxBreakdown,
        formatCurrency,
        formatPercentage
    };
}
