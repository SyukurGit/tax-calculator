'use strict';

const tax = require('../lib/tax');

describe('Tax Calculator', () => {
  it('taxes income progressively using each bracket marginal rate', () => {
    expect(tax.federalIncomeTax(50000)).toBe(6303.5);
  });

  it('is continuous across a bracket boundary', () => {
    const below = tax.federalIncomeTax(44725);
    const above = tax.federalIncomeTax(44725.01);

    expect(below).toBe(5143);
    expect(above - below).toBeLessThan(0.01);
  });

  it('charges no tax at zero income', () => {
    const result = tax.calculateTakeHome({ grossIncome: 0 });

    expect(result.incomeTax).toBe(0);
    expect(result.effectiveRate).toBe(0);
    expect(result.takeHome).toBe(0);
  });

  it('applies pre-tax deductions before calculating tax', () => {
    const result = tax.calculateTakeHome({ grossIncome: 50000, deductions: 5000 });

    expect(result.taxableIncome).toBe(45000);
    expect(result.incomeTax).toBe(5203.5);
  });

  it('rejects a negative income', () => {
    expect(() => tax.calculateTakeHome({ grossIncome: -1 })).toThrowError(RangeError);
  });

  it('rejects non-numeric income', () => {
    expect(() => tax.calculateTakeHome({ grossIncome: 'abc' })).toThrowError(TypeError);
  });

  it('applies VAT as a flat rate on taxable spend', () => {
    expect(tax.calculateVat(2400, 0.2)).toBe(480);
  });
});
