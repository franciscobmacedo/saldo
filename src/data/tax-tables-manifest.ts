// src/data/tax-tables-manifest.ts

// Example for one file: 2024/continente/2024-01-01_2024-08-31/SOME_TABLE_NAME.json
// You will need to import all your JSON files similarly.
// For example:
// import SOME_TABLE_NAME_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/SOME_TABLE_NAME.json';
// import ANOTHER_TABLE_NAME_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/ANOTHER_TABLE_NAME.json';
// etc. for all files in all year/location/date_range directories.

// This interface should match the structure of your JSON tax table files.
// It's based on the TaxRetentionTableJsonData interface previously seen.
interface TaxTableJsonData {
    situation: string;
    description: string;
    table: string;
    brackets: Array<{
        signal: "max" | "min";
        limit: number;
        max_marginal_rate: number;
        deduction: number;
        var1_deduction: number;
        var2_deduction: number;
        dependent_aditional_deduction: number;
        effective_mensal_rate: number;
    }>;
    dependent_disabled_addition_deduction?: number | null;
}

// --- START IMPORTS ---




// 2025 imports
import table1_single_or_married_2_holders__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';
import table1_single_or_married_2_holders__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS.json';
import table2_single_one_or_more_dependents__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS.json';
import table3_married_1_holder__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER.json';
import table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table5_single_one_or_more_dependents_person_with_disability__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY.json';
import table7_married_1_holder_person_with_disability__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY.json';

// --- END IMPORTS ---

export const taxTablesData: Record<string, TaxTableJsonData> = {
  

  

  // 2025 data
  "2025/acores/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE1_SINGLE_OR_MARRIED_2_HOLDERS": table1_single_or_married_2_holders__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE2_SINGLE_ONE_OR_MORE_DEPENDENTS": table2_single_one_or_more_dependents__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE3_MARRIED_1_HOLDER": table3_married_1_holder__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE4_SINGLE_OR_MARRIED_2_HOLDERS_NO_DEPENDENTS_PERSON_WITH_DISABILITY": table4_single_or_married_2_holders_no_dependents_person_with_disability__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE5_SINGLE_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table5_single_one_or_more_dependents_person_with_disability__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE6_MARRIED_2_HOLDERS_ONE_OR_MORE_DEPENDENTS_PERSON_WITH_DISABILITY": table6_married_2_holders_one_or_more_dependents_person_with_disability__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE7_MARRIED_1_HOLDER_PERSON_WITH_DISABILITY": table7_married_1_holder_person_with_disability__2025_madeira_2025100120251231 as TaxTableJsonData,

};

// Helper type for stronger typing if needed elsewhere
export type TaxTablesManifest = typeof taxTablesData;
