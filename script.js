function calculate(event) {
  if (event) event.preventDefault();
  try {
    var grossIncome = parseFloat(document.getElementById('gross-income').value) || 0;
    var taxDue = parseFloat(document.getElementById('tax-due').value) || 0;
    var deductions = parseFloat(document.getElementById('deductions').value) || 0;
    var vatBase = parseFloat(document.getElementById('vat-base').value) || 0;
    var vatRate = (parseFloat(document.getElementById('vat-rate').value) || 0) / 100;

    var result = taxCalculator.calculateTakeHome({
      grossIncome: grossIncome,
      deductions: deductions,
      vatBase: vatBase,
      vatRate: vatRate
    });

    var totalTaxesOwed = taxCalculator.round2(result.incomeTax + taxDue);
    var finalTakeHome = taxCalculator.round2(result.takeHome - taxDue);

    document.getElementById('r-taxable').textContent = taxCalculator.formatCurrency(result.taxableIncome);
    document.getElementById('r-tax').textContent = taxCalculator.formatCurrency(totalTaxesOwed);
    document.getElementById('r-vat').textContent = taxCalculator.formatCurrency(result.vat);
    document.getElementById('r-rate').textContent = result.effectiveRate.toFixed(2) + '%';
    document.getElementById('r-take').textContent = taxCalculator.formatCurrency(finalTakeHome);
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  calculate();
});
