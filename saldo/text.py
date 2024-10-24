from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from saldo.schemas import SimulationResult


def generate_salary_explanation(result: "SimulationResult") -> str:
    return f"""SALARY BREAKDOWN EXPLANATION

Your annual gross salary is {result.yearly_gross_salary:,.2f}€, which corresponds to a monthly gross income of {result.gross_income:,.2f}€.

MONTHLY BREAKDOWN:
• Gross Income: {result.gross_income:,.2f}€
• Taxable Income: {result.taxable_income:,.2f}€

DEDUCTIONS:
1. IRS (Income Tax):
   • Monthly amount: {result.tax:,.2f}€

2. Social Security:
   • Monthly contribution: {result.social_security:,.2f}€
   • Rate: {result.social_security_tax*100:,.2f}%

FINAL RESULT:
Your net monthly salary is {result.net_salary:,.2f}€

This means that:
• {(result.tax / result.gross_income * 100):.1f}% of your gross salary goes to income tax
• {(result.social_security / result.gross_income * 100):.1f}% goes to social security
• You take home {(result.net_salary / result.gross_income * 100):.1f}% of your gross salary

YEARLY PROJECTION:
• Gross Annual: {result.yearly_gross_salary:,.2f}€
• Net Annual: {result.yearly_net_salary:,.2f}€
• Total Annual Tax: {(result.tax * 12):,.2f}€
• Total Annual Social Security: {(result.social_security * 12):,.2f}€

Note: This calculation assumes a standard tax situation and may not include special deductions, 
benefits, or specific contractual conditions. Your actual values might vary based on your 
personal circumstances and any additional benefits or deductions that may apply.
"""
