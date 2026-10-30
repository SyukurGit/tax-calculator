// Jasmine Unit Tests for Tax Calculator Application
const {
    calculateTaxByBracket,
    calculateTaxBreakdown,
    formatCurrency,
    formatPercentage
} = require('../script.js');

describe('Tax Calculator Application Unit Tests', function() {

    describe('calculateTaxByBracket', function() {
        it('should return 0 tax for 0 or negative taxable income', function() {
            expect(calculateTaxByBracket(0, 'single')).toBe(0);
            expect(calculateTaxByBracket(-5000, 'single')).toBe(0);
        });

        it('should calculate correct tax for single filer in the 10% lowest bracket ($10,000)', function() {
            const tax = calculateTaxByBracket(10000, 'single');
            expect(tax).toBe(1000); // 10% of $10,000
        });

        it('should calculate correct tax crossing first bracket into 12% ($15,000)', function() {
            const tax = calculateTaxByBracket(15000, 'single');
            // $11,000 @ 10% = $1,100; $4,000 @ 12% = $480 -> Total = $1,580
            expect(tax).toBe(1580);
        });

        it('should calculate correct tax for single filer in middle bracket ($50,000)', function() {
            const tax = calculateTaxByBracket(50000, 'single');
            // $11,000 @ 10% = $1,100; $33,725 @ 12% = $4,047; $5,275 @ 22% = $1,160.50 -> Total = $6,307.50
            expect(tax).toBeCloseTo(6307.50, 2);
        });

        it('should calculate correct tax for married filing jointly ($50,000)', function() {
            const tax = calculateTaxByBracket(50000, 'married');
            // $22,000 @ 10% = $2,200; $28,000 @ 12% = $3,360 -> Total = $5,560
            expect(tax).toBe(5560);
        });

        it('should calculate correct tax for head of household ($50,000)', function() {
            const tax = calculateTaxByBracket(50000, 'head');
            // $15,700 @ 10% = $1,570; $34,300 @ 12% = $4,116 -> Total = $5,686
            expect(tax).toBe(5686);
        });

        it('should handle high income in upper tax bracket ($600,000)', function() {
            const tax = calculateTaxByBracket(600000, 'single');
            expect(tax).toBeGreaterThan(150000);
        });

        it('should accurately handle decimal amounts', function() {
            const tax = calculateTaxByBracket(12345.67, 'single');
            expect(tax).toBeCloseTo(1261.48, 2);
        });
    });

    describe('calculateTaxBreakdown', function() {
        it('should calculate complete breakdown with zero deductions', function() {
            const result = calculateTaxBreakdown(50000, 0, 'single');
            expect(result.grossIncome).toBe(50000);
            expect(result.deductions).toBe(0);
            expect(result.taxableIncome).toBe(50000);
            expect(result.totalTax).toBeCloseTo(6307.50, 2);
            expect(result.netIncome).toBeCloseTo(43692.50, 2);
            expect(result.effectiveTaxRate).toBeCloseTo(12.62, 2);
        });

        it('should apply deductions properly to reduce taxable income', function() {
            const result = calculateTaxBreakdown(50000, 10000, 'single');
            expect(result.grossIncome).toBe(50000);
            expect(result.deductions).toBe(10000);
            expect(result.taxableIncome).toBe(40000);
            expect(result.totalTax).toBeCloseTo(4580, 2);
        });

        it('should handle deductions exceeding gross income', function() {
            const result = calculateTaxBreakdown(30000, 50000, 'single');
            expect(result.taxableIncome).toBe(0);
            expect(result.totalTax).toBe(0);
            expect(result.effectiveTaxRate).toBe(0);
            expect(result.netIncome).toBe(30000);
        });

        it('should verify married filing status yields lower tax than single for equivalent income', function() {
            const single = calculateTaxBreakdown(80000, 10000, 'single');
            const married = calculateTaxBreakdown(80000, 10000, 'married');
            expect(married.totalTax).toBeLessThan(single.totalTax);
        });
    });

    describe('formatCurrency and formatPercentage', function() {
        it('should format numbers into standard USD currency string', function() {
            expect(formatCurrency(0)).toBe('$0.00');
            expect(formatCurrency(1250)).toBe('$1,250.00');
            expect(formatCurrency(1000000.5)).toBe('$1,000,000.50');
        });

        it('should format percentage values with two decimal digits', function() {
            expect(formatPercentage(0)).toBe('0.00%');
            expect(formatPercentage(15.6789)).toBe('15.68%');
            expect(formatPercentage(100)).toBe('100.00%');
        });
    });
});
