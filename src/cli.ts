#!/usr/bin/env node
import { Command } from "commander";
import { simulateIndependentWorker, simulateDependentWorker, simulateFromGreenReceiptsCsv } from "./index";
import fs from "fs";

const program = new Command();

program
    .name("saldo")
    .description("CLI to calculate salary and taxes in Portugal")
    .version("1.0.0");

program
    .command("dependent")
    .description("Simulate dependent worker salary and taxes")
    .requiredOption("--year <number>", "Year of the simulation", Number)
    .requiredOption("--income <number>", "Annual gross income", Number)
    .option("--married", "Is the worker married", false)
    .option("--disabled", "Is the worker disabled", false)
    .option("--partner-disabled", "Is the worker's partner disabled", false)
    .option("--location <location>", "Location (continent, madeira, azores)", "continent")
    .option("--number-of-holders <number>", "Number of holders (1, 2)", Number)
    .option("--number-of-dependents <number>", "Number of dependents", Number)
    .option("--number-of-dependents-disabled <number>", "Number of disabled dependents", Number)
    .option("--social-security-contribution-rate <number>", "Social security contribution rate", Number)
    .option("--twelfths <number>", "Twelfths portion (0, 0.5, 1, 2)", Number)
    .option("--lunch-allowance-daily-value <number>", "Lunch allowance daily value", Number)
    .option("--lunch-allowance-mode <mode>", "Lunch allowance mode (cupon, salary)", "salary")
    .option("--lunch-allowance-days-count <number>", "Lunch allowance days count per month", Number)
    .option("--include-lunch-allowance-in-june", "Include lunch allowance in June", false)
    .option("--one-half-month-twelfths-lump-sum-month <month>", "Month for lump sum (june, december)")
    .action((options) => {
        try {
            const result = simulateDependentWorker({
                year: options.year,
                income: options.income,
                married: options.married,
                disabled: options.disabled,
                partnerDisabled: options.partnerDisabled,
                location: options.location,
                numberOfHolders: options.numberOfHolders,
                numberOfDependents: options.numberOfDependents,
                numberOfDependentsDisabled: options.numberOfDependentsDisabled,
                // @ts-ignore
                socialSecurityContributionRate: options.socialSecurityContributionRate,
                twelfths: options.twelfths,
                lunchAllowanceDailyValue: options.lunchAllowanceDailyValue,
                // @ts-ignore
                lunchAllowanceMode: options.lunchAllowanceMode,
                lunchAllowanceDaysCount: options.lunchAllowanceDaysCount,
                includeLunchAllowanceInJune: options.includeLunchAllowanceInJune,
                // @ts-ignore
                oneHalfMonthTwelfthsLumpSumMonth: options.oneHalfMonthTwelfthsLumpSumMonth,
            });
            console.log(JSON.stringify(result, null, 2));
        } catch (e: any) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command("independent")
    .description("Simulate independent worker salary and taxes")
    .requiredOption("--income <value>", "Gross income (single number or comma-separated list of 12 values)")
    .option("--income-frequency <freq>", "Income frequency (year, month, day)", "year")
    .option("--year-business-days <number>", "Number of business days in the year", Number)
    .option("--nr-days-off <number>", "Number of days off", Number)
    .option("--ss-discount <number>", "Social Security discount (e.g. 0 or 25)", Number)
    .option("--max-expenses-tax <number>", "Maximum expenses tax", Number)
    .option("--expenses <number>", "Declared expenses", Number)
    .option("--ss-tax <number>", "Fixed Social Security tax amount", Number)
    .option("--irs-retention-rate <number>", "IRS retention rate percentage (e.g., 25 for 25%)", Number)
    .option("--current-tax-rank-year <number>", "Current tax rank year (2023, 2024, 2025, 2026)", Number)
    .option("--rnh", "Is Non-Habitual Resident (RNH)", false)
    .option("--rnh-tax <number>", "RNH flat tax percentage", Number)
    .option("--date-of-opening-activity <date>", "Date of opening activity (YYYY-MM-DD)")
    .option("--benefits-of-youth-irs", "Benefits of youth IRS", false)
    .option("--year-of-youth-irs <number>", "Year of youth IRS", Number)
    .option("--previous-year-q4-monthly-income <number>", "Average monthly income in Q4 of previous year", Number)
    .option("--approximate-q1-from-current-year-q4", "If previous year Q4 is missing, estimate Q1 SS from current-year Q4", false)
    .action((options) => {
        try {
            let parsedIncome: number | number[];
            if (options.income.includes(",")) {
                parsedIncome = options.income.split(",").map((v: string) => parseFloat(v.trim()));
                if ((parsedIncome as number[]).length !== 12) {
                    throw new Error("Income array must have exactly 12 values if calculating per month.");
                }
            } else {
                parsedIncome = parseFloat(options.income);
            }

            const result = simulateIndependentWorker({
                income: parsedIncome,
                // @ts-ignore
                incomeFrequency: options.incomeFrequency,
                yearBusinessDays: options.yearBusinessDays,
                nrDaysOff: options.nrDaysOff,
                ssDiscount: options.ssDiscount,
                maxExpensesTax: options.maxExpensesTax,
                expenses: options.expenses,
                ssTax: options.ssTax,
                irsRetentionRate: options.irsRetentionRate !== undefined ? options.irsRetentionRate / 100 : undefined,
                currentTaxRankYear: options.currentTaxRankYear as any,
                rnh: options.rnh,
                rnhTax: options.rnhTax !== undefined ? options.rnhTax / 100 : undefined,
                dateOfOpeningActivity: options.dateOfOpeningActivity ? new Date(options.dateOfOpeningActivity) : undefined,
                benefitsOfYouthIrs: options.benefitsOfYouthIrs,
                yearOfYouthIrs: options.yearOfYouthIrs,
                previousYearQ4MonthlyIncome: options.previousYearQ4MonthlyIncome,
                approximateQ1FromCurrentYearQ4: options.approximateQ1FromCurrentYearQ4,
            });
            console.log(JSON.stringify(result, null, 2));
        } catch (e: any) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command("independent-csv")
    .description("Simulate independent worker salary and taxes from a Green Receipts CSV file")
    .requiredOption("--csv <path>", "Path to the green receipts CSV file")
    .option("--year-business-days <number>", "Number of business days in the year", Number)
    .option("--nr-days-off <number>", "Number of days off", Number)
    .option("--ss-discount <number>", "Social Security discount (e.g. 0 or 25)", Number)
    .option("--max-expenses-tax <number>", "Maximum expenses tax", Number)
    .option("--expenses <number>", "Declared expenses", Number)
    .option("--ss-tax <number>", "Fixed Social Security tax amount", Number)
    .option("--irs-retention-rate <number>", "IRS retention rate percentage (e.g., 25 for 25%)", Number)
    .option("--current-tax-rank-year <number>", "Current tax rank year (2023, 2024, 2025, 2026)", Number)
    .option("--rnh", "Is Non-Habitual Resident (RNH)", false)
    .option("--rnh-tax <number>", "RNH flat tax percentage", Number)
    .option("--date-of-opening-activity <date>", "Date of opening activity (YYYY-MM-DD)")
    .option("--benefits-of-youth-irs", "Benefits of youth IRS", false)
    .option("--year-of-youth-irs <number>", "Year of youth IRS", Number)
    .option("--approximate-q1-from-current-year-q4", "If previous year Q4 is missing, estimate Q1 SS from current-year Q4", false)
    .action((options) => {
        try {
            const csvContent = fs.readFileSync(options.csv, "utf-8");

            // Log some summary information to help the user
            const targetYear = options.currentTaxRankYear || 2024;
            console.error(`\x1b[1m\x1b[34m→ Simulating independent worker from CSV: ${options.csv}\x1b[0m`);
            console.error(`\x1b[1m\x1b[34m→ Target collection/simulation year: ${targetYear}\x1b[0m`);

            const result = simulateFromGreenReceiptsCsv({
                csvContent,
                yearBusinessDays: options.yearBusinessDays,
                nrDaysOff: options.nrDaysOff,
                ssDiscount: options.ssDiscount,
                maxExpensesTax: options.maxExpensesTax,
                expenses: options.expenses,
                ssTax: options.ssTax,
                irsRetentionRate: options.irsRetentionRate !== undefined ? options.irsRetentionRate / 100 : undefined,
                currentTaxRankYear: options.currentTaxRankYear as any,
                rnh: options.rnh,
                rnhTax: options.rnhTax !== undefined ? options.rnhTax / 100 : undefined,
                dateOfOpeningActivity: options.dateOfOpeningActivity ? new Date(options.dateOfOpeningActivity) : undefined,
                benefitsOfYouthIrs: options.benefitsOfYouthIrs,
                yearOfYouthIrs: options.yearOfYouthIrs,
                approximateQ1FromCurrentYearQ4: options.approximateQ1FromCurrentYearQ4,
            });

            // Log a summary of picked up income
            const yearIncome = result.grossIncome.year;
            console.error(`\x1b[1m\x1b[32m✔ Detected gross income for ${targetYear}: ${yearIncome.toFixed(2)}€\x1b[0m`);

            if (result.ssQ1Approximated) {
                console.error(`\x1b[33m⚠ Previous-year Q4 income not found in CSV. Q1 SS was estimated from current-year Q4 because approximation was enabled.\x1b[0m`);
            } else {
                console.error(`\x1b[32m✔ Q1 SS was not approximated. It used previous-year Q4 when available; otherwise Jan/Feb/Mar SS is 0.\x1b[0m`);
            }

            console.log(JSON.stringify(result, null, 2));
        } catch (e: any) {
            console.error(e.message);
            process.exit(1);
        }
    });

program.parse();
