import { simulateDependentWorker } from "../../src/dependent-worker/simulator";

export interface DoutorFinancasRequest {
  location: "continente" | "acores" | "madeira";
  marital_status: "SOL" | "CAS1" | "CAS2";
  number_of_dependents: number;
  disability_above_60: boolean;
  spouse_has_disability: boolean;
  dependents_have_disability: boolean;
  number_of_dependents_with_disability: number;
  base_salary: string;
  extraordinary_compensation: string;
  other_irs_ss_income: string;
  other_irs_income: string;
  other_exempt_income: string;
  social_security_rate: number;
  twelfths: string;
  meal_card_type: "voucher_card" | "cash";
  daily_meal_card_value: string;
  meal_card_days: number;
  year: string;
  month: string;
  processType: number;
  operationType: number;
}

export interface DoutorFinancasResponse {
  status: string;
  result: {
    simulation: {
      net_salary: number;
      gross_salary: number;
      irs_withholding: number;
      ss_contribution: number;
    };
    net_salary: {
      net_income: number;
      meal_allowance: number;
      twelfths: number;
      net_salary: number;
    };
    gross_salary: {
      taxable_income: number;
      extra_compensation: number;
      meal_allowance: number;
      twelfths: number;
      other_income: number;
      gross_salary: number;
      extra_taxed_meal: number;
    };
  };
}

export interface TestScenario {
  name: string;
  observations?: string;
  doutorFinancasRequest: DoutorFinancasRequest;
  saldoRequest: Parameters<typeof simulateDependentWorker>[0];
}
