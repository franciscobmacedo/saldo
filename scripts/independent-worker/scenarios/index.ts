import { IndependentWorkerTestScenario } from "../types";

// Basic Scenarios
import { basicIndependentWorkerScenarios } from "./basic/basic-scenarios";

// Income Level Scenarios
import { incomeLevelScenarios } from "./income-level/income-level-scenarios";

// Income Frequency Scenarios
import { incomeFrequencyScenarios } from "./income-frequency/income-frequency-scenarios";

// Expense Scenarios
import { expenseScenarios } from "./expenses/expense-scenarios";

// Regional Scenarios
import { regionalScenarios } from "./regional/regional-scenarios";

// Social Security Scenarios
import { socialSecurityScenarios } from "./social-security/social-security-scenarios";

// RNH Scenarios
import { rnhScenarios } from "./rnh/rnh-scenarios";

// Edge Cases Scenarios
import { edgeCasesScenarios } from "./edge-cases/edge-cases-scenarios";

// Real-World Scenarios
import { realWorldScenarios } from "./real-world/real-world-scenarios";

// Configuration & System Testing Scenarios
import { configurationScenarios } from "./configuration/configuration-scenarios";

// Error Scenarios
import { errorScenarios } from "./error-scenarios/error-scenarios";

export const independentWorkerTestScenarios: IndependentWorkerTestScenario[] = [
    // Basic Scenarios
    ...basicIndependentWorkerScenarios, // ✅ Basic independent worker scenarios with various income levels and frequencies
    
    // Income Level Scenarios
    ...incomeLevelScenarios, // ✅ Comprehensive income level scenarios covering €5,000 to €150,000
    
    // Income Frequency Scenarios
    ...incomeFrequencyScenarios, // ✅ Comprehensive income frequency scenarios covering monthly and daily frequencies with various days off
    
    // Expense Scenarios
    ...expenseScenarios, // ✅ Comprehensive expense scenarios covering simplified regime rates, organized accounting, and break-even analysis
    
    // Regional Scenarios
    ...regionalScenarios, // ✅ Comprehensive regional scenarios covering different tax periods (January-July, August-December, mid-year, late year) with various income levels and combinations
    
    // Social Security Scenarios
    ...socialSecurityScenarios, // ✅ Comprehensive social security scenarios covering standard rates, discounts (10%, 25%, 50%), rate variations (18%, 21.4%, 25%), SS caps, and edge cases
    
    // RNH Scenarios
    ...rnhScenarios, // ✅ Comprehensive RNH scenarios covering standard RNH, comparisons with standard regime, different tax rates, and edge cases
    
    // Edge Cases Scenarios
    ...edgeCasesScenarios, // ✅ Comprehensive edge cases and boundary testing scenarios covering income boundaries, parameter edge cases, date edge cases, and calculation edge cases
    
    // Configuration & System Testing Scenarios
    ...configurationScenarios, // ✅ Configuration & system testing scenarios covering parameter validation, default values, and complex combinations
    
    // Real-World Scenarios
    ...realWorldScenarios, // ✅ Real-world scenarios covering common freelancer profiles, seasonal workers, and career transitions
    
    // Error Scenarios
    ...errorScenarios, // ✅ Error scenarios covering invalid input handling, edge case error conditions, and graceful degradation testing
];
