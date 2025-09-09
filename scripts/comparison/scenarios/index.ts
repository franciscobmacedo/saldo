import { TestScenario } from "../types";

// Marital Status Scenarios
import { singlePersonScenarios } from "./marital-status/single-person-scenarios";
import { married1HolderScenarios } from "./marital-status/married-1-holder-scenarios";
import { married2HoldersScenarios } from "./marital-status/married-2-holders-scenarios";

// Regional Scenarios
import { acoresSinglePersonScenarios } from "./regional/acores-single-person-scenarios";
import { acoresMarriedScenarios } from "./regional/acores-married-scenarios";
import { madeiraSinglePersonScenarios } from "./regional/madeira-single-person-scenarios";
import { madeiraMarriedScenarios } from "./regional/madeira-married-scenarios";
import {
    acoresSinglePersonDisabilityDependentsScenarios,
    madeiraSinglePersonDisabilityDependentsScenarios,
    acoresMarriedDisabilityScenarios,
    madeiraMarriedDisabilityScenarios,
    regionalEdgeCasesFailingScenarios,
} from "./regional/regional-edge-cases-scenarios";

// Disability Scenarios
import { disabilityScenarios } from "./disability/disability-scenarios";

// Dependents Scenarios
import { dependentsDisabilityScenarios } from "./dependents/dependents-disability-scenarios";
import { marriedDependentsDisabilityScenarios } from "./dependents/married-dependents-disability-scenarios";
import { married2HoldersDependentsDisabilityScenarios } from "./dependents/married-2-holders-dependents-disability-scenarios";
import { personDisabilityDependentsDisabilityScenarios } from "./dependents/person-disability-dependents-disability-scenarios";
import { personDisabilityDependentsDisabilityScenariosFAILING } from "./dependents/person-disability-dependents-disability-scenarios-failing";
import { marriedPersonDisabilityDependentsDisabilityScenarios } from "./dependents/married-person-disability-dependents-disability-scenarios";
import { married2HoldersPersonDisabilityDependentsDisabilityScenarios } from "./dependents/married2-holders-person-disability-dependents-disability-scenarios";
import { married2HoldersPersonDisabilityDependentsDisabilityScenariosFAILING } from "./dependents/married2-holders-person-disability-dependents-disability-scenarios-failing";
import { married2HoldersRemainingPersonDisabilityDependentsDisabilityScenarios } from "./dependents/married2-holders-remaining-person-disability-dependents-disability-scenarios";
import { married2HoldersRemainingPersonDisabilityDependentsDisabilityScenariosFAILING } from "./dependents/married2-holders-remaining-person-disability-dependents-disability-scenarios-failing";
import { personDisabilitySpouseDisabilityScenarios, personDisabilitySpouseDisabilityScenariosFAILING } from "./dependents/person-disability-spouse-disability-scenarios";
import { married1HolderDisabilitySpouse1DependentScenarios } from "./dependents/married-1-holder-disability-spouse-1-dependent";
import { married1HolderDisabilitySpouse2Dependents1DisabledScenarios } from "./dependents/married-1-holder-disability-spouse-2-dependents-1-disabled";
import { married1HolderDisabilitySpouse2DependentsBothDisabledScenarios } from "./dependents/married-1-holder-disability-spouse-2-dependents-both-disabled";
import { married1HolderDisabilitySpouse3plusDependentsScenarios } from "./dependents/married-1-holder-disability-spouse-3plus-dependents";
import { married2HoldersDisabilitySpouseScenarios } from "./dependents/married-2-holders-disability-spouse";

// Twelfths Scenarios
import { noTwelfthsScenarios } from "./twelfths/no-twelfths-scenarios";
import { halfMonthTwelfthsScenarios } from "./twelfths/half-month-twelfths-scenarios";
import { oneMonthTwelfthsScenarios } from "./twelfths/one-month-twelfths-scenarios";
import { twoMonthsTwelfthsScenarios } from "./twelfths/two-months-twelfths-scenarios";
import { twelfthsEdgeCasesScenarios } from "./twelfths/twelfths-edge-cases-scenarios";

// Lunch Allowance Scenarios
import { singlePersonLunchAllowanceScenarios } from "./lunch-allowance/single-person-lunch-allowance";
import { married1HolderLunchAllowanceScenarios } from "./lunch-allowance/married-1-holder-lunch-allowance";
import { married2HoldersLunchAllowanceScenarios } from "./lunch-allowance/married-2-holders-lunch-allowance";
import { salaryModeLunchAllowanceScenarios } from "./lunch-allowance/salary-mode-lunch-allowance";
import { lunchAllowanceEdgeCasesScenarios } from "./lunch-allowance/lunch-allowance-edge-cases-scenarios";

// Social Security Scenarios
import { socialSecurityScenarios } from "./social-security/social-security-scenarios";

// Edge Cases Scenarios
import { edgeCasesScenarios } from "./edge-cases/edge-cases-scenarios";
import { dateRangeEdgeCasesScenarios, dateRangeEdgeCasesFailingScenarios } from "./edge-cases/date-range-edge-cases-scenarios";
import { midYearPeriodScenarios } from "./edge-cases/mid-year-period-scenarios";
import { lateYearPeriodScenarios } from "./edge-cases/late-year-period-scenarios";
import { maximumIncomeScenarios } from "./edge-cases/maximum-income-scenarios";

export const testScenarios: TestScenario[] = [
    // Marital Status Scenarios
    ...singlePersonScenarios,  // ✅
    ...married1HolderScenarios, // ✅
    ...married2HoldersScenarios, // ✅
    
    // // Regional Scenarios
    ...acoresSinglePersonScenarios, // ✅
    ...acoresMarriedScenarios, // ✅
    ...madeiraSinglePersonScenarios, // ✅
    ...madeiraMarriedScenarios, // ✅
    ...acoresSinglePersonDisabilityDependentsScenarios, // ✅ Single person in Açores with disability and dependents
    ...madeiraSinglePersonDisabilityDependentsScenarios, // ✅ Single person in Madeira with disability and dependents
    ...acoresMarriedDisabilityScenarios, // ✅ Married scenarios in Açores with various disability combinations
    ...madeiraMarriedDisabilityScenarios, // ✅ Married scenarios in Madeira with various disability combinations
    
    // // Disability Scenarios
    ...disabilityScenarios, // ✅    
    ...dependentsDisabilityScenarios, // ✅
    ...marriedDependentsDisabilityScenarios, // ✅
    ...married2HoldersDependentsDisabilityScenarios, // ✅
    ...personDisabilityDependentsDisabilityScenarios, // ✅
    ...marriedPersonDisabilityDependentsDisabilityScenarios, // ✅
    ...married2HoldersPersonDisabilityDependentsDisabilityScenarios, // ✅
    ...married2HoldersRemainingPersonDisabilityDependentsDisabilityScenarios, // ✅

    // // Dependents Scenarios
    ...personDisabilitySpouseDisabilityScenarios, // ✅
    ...married1HolderDisabilitySpouse1DependentScenarios, // ✅
    ...married1HolderDisabilitySpouse2Dependents1DisabledScenarios, // ✅
    ...married1HolderDisabilitySpouse2DependentsBothDisabledScenarios, // ✅
    ...married1HolderDisabilitySpouse3plusDependentsScenarios, // ✅
    ...married2HoldersDisabilitySpouseScenarios, // ✅
    
    // // Twelfths Scenarios
    ...noTwelfthsScenarios, // ✅
    ...halfMonthTwelfthsScenarios, // ✅ 1x50% - One allowance at 50%
    ...oneMonthTwelfthsScenarios, // ✅ 2x50% - Two allowances at 50% each
    ...twoMonthsTwelfthsScenarios, // ✅ 2x100% - Two allowances at 100% each
    ...twelfthsEdgeCasesScenarios, // ✅ Twelfths edge cases (high income with no twelfths, low income with max twelfths, disability scenarios, dependents scenarios)
    
    // Lunch Allowance Scenarios
    ...singlePersonLunchAllowanceScenarios, // ✅
    ...married1HolderLunchAllowanceScenarios, // ✅
    ...married2HoldersLunchAllowanceScenarios, // ✅
    ...salaryModeLunchAllowanceScenarios, // ✅
    ...lunchAllowanceEdgeCasesScenarios, // ✅ Lunch allowance edge cases
    
    // // Social Security Scenarios
    ...socialSecurityScenarios, // ✅ Social security rate variations (9% vs 11%)
    
    // // Edge Cases Scenarios
    ...midYearPeriodScenarios, // ✅ Mid year period (Aug-Sep 2025) scenarios
    ...lateYearPeriodScenarios, // ✅ Late year period (Oct-Dec 2025) scenarios
    ...edgeCasesScenarios, // ✅ Edge cases and boundary conditions
    ...dateRangeEdgeCasesScenarios, // ✅ Date range edge cases (multiple periods, boundaries, full year, partial year)
    ...maximumIncomeScenarios, // ✅ Maximum income scenarios (5000€+ and highest tax brackets)
    
    // Commented out failing scenarios
    // ...personDisabilitySpouseDisabilityScenariosFAILING, // ❌ I believe it's because Doutor Finanças is using the wrong table for this scenario - they select table 1, when the person itself has disability - doesn't make sense.
    // ...personDisabilityDependentsDisabilityScenariosFAILING, // ❌ Disability scenarios failing due to DF error - they select the wrong table for disability scenarios
    // ...married2HoldersPersonDisabilityDependentsDisabilityScenariosFAILING, // ❌ Married 2 holders disability scenarios failing due to DF error - they select the wrong table for disability scenarios
    // ...married2HoldersRemainingPersonDisabilityDependentsDisabilityScenariosFAILING, // ❌ Married 2 holders remaining disability scenarios failing due to DF error - they select the wrong table for disability scenarios
    // ...dateRangeEdgeCasesFailingScenarios, // ❌ Date range edge cases failing - because of tables selection - DF is using the january table instead of the august/october one.
    // ...regionalEdgeCasesFailingScenarios, // ❌ Regional edge cases failing - because of tables selection - DF is using the january table instead of the august/october one.
];