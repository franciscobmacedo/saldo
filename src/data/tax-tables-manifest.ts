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
import table1_solteiro_ou_casado_2_titulares__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_acores_2025010120250731 from './retention-tax-tables/2025/acores/2025-01-01_2025-07-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_acores_2025080120250930 from './retention-tax-tables/2025/acores/2025-08-01_2025-09-30/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_acores_2025100120251231 from './retention-tax-tables/2025/acores/2025-10-01_2025-12-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_continente_2025010120250731 from './retention-tax-tables/2025/continente/2025-01-01_2025-07-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_continente_2025080120250930 from './retention-tax-tables/2025/continente/2025-08-01_2025-09-30/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_continente_2025100120251231 from './retention-tax-tables/2025/continente/2025-10-01_2025-12-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_madeira_2025010120250731 from './retention-tax-tables/2025/madeira/2025-01-01_2025-07-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_madeira_2025080120250930 from './retention-tax-tables/2025/madeira/2025-08-01_2025-09-30/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';
import table1_solteiro_ou_casado_2_titulares__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES.json';
import table2_solteiro_um_ou_mais_dependentes__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES.json';
import table3_casado_1_titular__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE3_CASADO_1_TITULAR.json';
import table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF.json';
import table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF.json';
import table7_casado_1_titular_pessoa_com_def__2025_madeira_2025100120251231 from './retention-tax-tables/2025/madeira/2025-10-01_2025-12-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF.json';

// --- END IMPORTS ---

export const taxTablesData: Record<string, TaxTableJsonData> = {
  

  // 2025 data
  "2025/acores/2025-01-01_2025-07-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-01-01_2025-07-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_acores_2025010120250731 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-08-01_2025-09-30/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_acores_2025080120250930 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/acores/2025-10-01_2025-12-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_acores_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-01-01_2025-07-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_continente_2025010120250731 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-08-01_2025-09-30/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_continente_2025080120250930 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/continente/2025-10-01_2025-12-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_continente_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-01-01_2025-07-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_madeira_2025010120250731 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-08-01_2025-09-30/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_madeira_2025080120250930 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE1_SOLTEIRO_OU_CASADO_2_TITULARES": table1_solteiro_ou_casado_2_titulares__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE2_SOLTEIRO_UM_OU_MAIS_DEPENDENTES": table2_solteiro_um_ou_mais_dependentes__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE3_CASADO_1_TITULAR": table3_casado_1_titular__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE4_SOLTEIRO_OU_CASADO_2_TITULARES_SEM_DEPENDENTES_PESSOA_COM_DEF": table4_solteiro_ou_casado_2_titulares_sem_dependentes_pessoa_com_def__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE5_SOLTEIRO_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table5_solteiro_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE6_CASADO_2_TITULARES_UM_OU_MAIS_DEPENDENTES_PESSOA_COM_DEF": table6_casado_2_titulares_um_ou_mais_dependentes_pessoa_com_def__2025_madeira_2025100120251231 as TaxTableJsonData,
  "2025/madeira/2025-10-01_2025-12-31/TABLE7_CASADO_1_TITULAR_PESSOA_COM_DEF": table7_casado_1_titular_pessoa_com_def__2025_madeira_2025100120251231 as TaxTableJsonData,

};

// Helper type for stronger typing if needed elsewhere
export type TaxTablesManifest = typeof taxTablesData;
