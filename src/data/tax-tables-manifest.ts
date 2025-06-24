// src/data/tax-tables-manifest.ts

// Example for one file: 2024/continente/2024-01-01_2024-08-31/SOLD.json
// You will need to import all your JSON files similarly.
// For example:
// import sold_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/SOLD.json';
// import cas1_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/CAS1.json';
// etc. for all files in all year/location/date_range directories.

// This interface should match the structure of your JSON tax table files.
// It's based on the TaxRetentionTableJsonData interface previously seen.
interface TaxTableJsonData {
    situation: string;
    description: string;
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

// 2024/acores/2024-01-01_2024-08-31
import sold_def_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/SOLD+DEF.json';
import sold_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/SOLD.json';
import solcas2_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/SOLCAS2.json';
import cas2d_def_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/CAS2D+DEF.json';
import solcas2_def_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/SOLCAS2+DEF.json';
import cas1_def_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/CAS1+DEF.json';
import cas1_2024_acores_0101_0831 from './retention-tax-tables/2024/acores/2024-01-01_2024-08-31/CAS1.json';

// 2024/acores/2024-09-01_2024-10-31
import sold_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/SOLD.json';
import solcas2_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/SOLCAS2.json';
import sold_def_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/SOLD+DEF.json';
import cas2d_def_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/CAS2D+DEF.json';
import solcas2_def_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/SOLCAS2+DEF.json';
import cas1_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/CAS1.json';
import cas1_def_2024_acores_0901_1031 from './retention-tax-tables/2024/acores/2024-09-01_2024-10-31/CAS1+DEF.json';

// 2024/acores/2024-11-01_2024-12-31
import sold_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/SOLD.json';
import solcas2_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/SOLCAS2.json';
import sold_def_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/SOLD+DEF.json';
import cas2d_def_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/CAS2D+DEF.json';
import solcas2_def_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/SOLCAS2+DEF.json';
import cas1_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/CAS1.json';
import cas1_def_2024_acores_1101_1231 from './retention-tax-tables/2024/acores/2024-11-01_2024-12-31/CAS1+DEF.json';

// 2024/continente/2024-01-01_2024-08-31
import sold_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/SOLD.json';
import sold_def_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/SOLD+DEF.json';
import solcas2_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/SOLCAS2.json';
import cas2d_def_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/CAS2D+DEF.json';
import solcas2_def_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/SOLCAS2+DEF.json';
import cas1_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/CAS1.json';
import cas1_def_2024_continente_0101_0831 from './retention-tax-tables/2024/continente/2024-01-01_2024-08-31/CAS1+DEF.json';

// 2024/continente/2024-09-01_2024-10-31
import sold_def_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/SOLD+DEF.json';
import sold_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/SOLD.json';
import solcas2_def_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/SOLCAS2+DEF.json';
import solcas2_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/SOLCAS2.json';
import cas1_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/CAS1.json';
import cas2d_def_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/CAS2D+DEF.json';
import cas1_def_2024_continente_0901_1031 from './retention-tax-tables/2024/continente/2024-09-01_2024-10-31/CAS1+DEF.json';

// 2024/continente/2024-11-01_2024-12-31
import sold_def_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/SOLD+DEF.json';
import sold_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/SOLD.json';
import cas2d_def_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/CAS2D+DEF.json';
import solcas2_def_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/SOLCAS2+DEF.json';
import solcas2_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/SOLCAS2.json';
import cas1_def_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/CAS1+DEF.json';
import cas1_2024_continente_1101_1231 from './retention-tax-tables/2024/continente/2024-11-01_2024-12-31/CAS1.json';

// 2024/madeira/2024-01-01_2024-08-31
import solcas2_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/SOLCAS2.json';
import sold_def_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/SOLD+DEF.json';
import sold_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/SOLD.json';
import solcas2_def_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/SOLCAS2+DEF.json';
import cas2d_def_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/CAS2D+DEF.json';
import cas2d_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/CAS2D.json';
import cas1d_def_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/CAS1D+DEF.json';
import cas1d_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/CAS1D.json';
import cas1_def_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/CAS1+DEF.json';
import cas1_2024_madeira_0101_0831 from './retention-tax-tables/2024/madeira/2024-01-01_2024-08-31/CAS1.json';

// 2024/madeira/2024-09-01_2024-10-31
import sold_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/SOLD.json';
import solcas2_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/SOLCAS2.json';
import sold_def_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/SOLD+DEF.json';
import cas1_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/CAS1.json';
import cas2d_def_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/CAS2D+DEF.json';
import solcas2_def_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/SOLCAS2+DEF.json';
import cas1_def_2024_madeira_0901_1031 from './retention-tax-tables/2024/madeira/2024-09-01_2024-10-31/CAS1+DEF.json';

// 2024/madeira/2024-11-01_2024-12-31
import sold_def_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/SOLD+DEF.json';
import sold_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/SOLD.json';
import solcas2_def_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/SOLCAS2+DEF.json';
import solcas2_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/SOLCAS2.json';
import cas2d_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/CAS2D.json';
import cas1d_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/CAS1D.json';
import cas2d_def_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/CAS2D+DEF.json';
import cas1_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/CAS1.json';
import cas1d_def_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/CAS1D+DEF.json';
import cas1_def_2024_madeira_1101_1231 from './retention-tax-tables/2024/madeira/2024-11-01_2024-12-31/CAS1+DEF.json';

// --- END IMPORTS ---

export const taxTablesData: Record<string, TaxTableJsonData> = {
  // 2024/acores/2024-01-01_2024-08-31
  "2024/acores/2024-01-01_2024-08-31/SOLD+DEF": sold_def_2024_acores_0101_0831 as TaxTableJsonData,
  "2024/acores/2024-01-01_2024-08-31/SOLD": sold_2024_acores_0101_0831 as TaxTableJsonData,
  "2024/acores/2024-01-01_2024-08-31/SOLCAS2": solcas2_2024_acores_0101_0831 as TaxTableJsonData,
  "2024/acores/2024-01-01_2024-08-31/CAS2D+DEF": cas2d_def_2024_acores_0101_0831 as TaxTableJsonData,
  "2024/acores/2024-01-01_2024-08-31/SOLCAS2+DEF": solcas2_def_2024_acores_0101_0831 as TaxTableJsonData,
  "2024/acores/2024-01-01_2024-08-31/CAS1+DEF": cas1_def_2024_acores_0101_0831 as TaxTableJsonData,
  "2024/acores/2024-01-01_2024-08-31/CAS1": cas1_2024_acores_0101_0831 as TaxTableJsonData,

  // 2024/acores/2024-09-01_2024-10-31
  "2024/acores/2024-09-01_2024-10-31/SOLD": sold_2024_acores_0901_1031 as TaxTableJsonData,
  "2024/acores/2024-09-01_2024-10-31/SOLCAS2": solcas2_2024_acores_0901_1031 as TaxTableJsonData,
  "2024/acores/2024-09-01_2024-10-31/SOLD+DEF": sold_def_2024_acores_0901_1031 as TaxTableJsonData,
  "2024/acores/2024-09-01_2024-10-31/CAS2D+DEF": cas2d_def_2024_acores_0901_1031 as TaxTableJsonData,
  "2024/acores/2024-09-01_2024-10-31/SOLCAS2+DEF": solcas2_def_2024_acores_0901_1031 as TaxTableJsonData,
  "2024/acores/2024-09-01_2024-10-31/CAS1": cas1_2024_acores_0901_1031 as TaxTableJsonData,
  "2024/acores/2024-09-01_2024-10-31/CAS1+DEF": cas1_def_2024_acores_0901_1031 as TaxTableJsonData,

  // 2024/acores/2024-11-01_2024-12-31
  "2024/acores/2024-11-01_2024-12-31/SOLD": sold_2024_acores_1101_1231 as TaxTableJsonData,
  "2024/acores/2024-11-01_2024-12-31/SOLCAS2": solcas2_2024_acores_1101_1231 as TaxTableJsonData,
  "2024/acores/2024-11-01_2024-12-31/SOLD+DEF": sold_def_2024_acores_1101_1231 as TaxTableJsonData,
  "2024/acores/2024-11-01_2024-12-31/CAS2D+DEF": cas2d_def_2024_acores_1101_1231 as TaxTableJsonData,
  "2024/acores/2024-11-01_2024-12-31/SOLCAS2+DEF": solcas2_def_2024_acores_1101_1231 as TaxTableJsonData,
  "2024/acores/2024-11-01_2024-12-31/CAS1": cas1_2024_acores_1101_1231 as TaxTableJsonData,
  "2024/acores/2024-11-01_2024-12-31/CAS1+DEF": cas1_def_2024_acores_1101_1231 as TaxTableJsonData,

  // 2024/continente/2024-01-01_2024-08-31
  "2024/continente/2024-01-01_2024-08-31/SOLD": sold_2024_continente_0101_0831 as TaxTableJsonData,
  "2024/continente/2024-01-01_2024-08-31/SOLD+DEF": sold_def_2024_continente_0101_0831 as TaxTableJsonData,
  "2024/continente/2024-01-01_2024-08-31/SOLCAS2": solcas2_2024_continente_0101_0831 as TaxTableJsonData,
  "2024/continente/2024-01-01_2024-08-31/CAS2D+DEF": cas2d_def_2024_continente_0101_0831 as TaxTableJsonData,
  "2024/continente/2024-01-01_2024-08-31/SOLCAS2+DEF": solcas2_def_2024_continente_0101_0831 as TaxTableJsonData,
  "2024/continente/2024-01-01_2024-08-31/CAS1": cas1_2024_continente_0101_0831 as TaxTableJsonData,
  "2024/continente/2024-01-01_2024-08-31/CAS1+DEF": cas1_def_2024_continente_0101_0831 as TaxTableJsonData,

  // 2024/continente/2024-09-01_2024-10-31
  "2024/continente/2024-09-01_2024-10-31/SOLD+DEF": sold_def_2024_continente_0901_1031 as TaxTableJsonData,
  "2024/continente/2024-09-01_2024-10-31/SOLD": sold_2024_continente_0901_1031 as TaxTableJsonData,
  "2024/continente/2024-09-01_2024-10-31/SOLCAS2+DEF": solcas2_def_2024_continente_0901_1031 as TaxTableJsonData,
  "2024/continente/2024-09-01_2024-10-31/SOLCAS2": solcas2_2024_continente_0901_1031 as TaxTableJsonData,
  "2024/continente/2024-09-01_2024-10-31/CAS1": cas1_2024_continente_0901_1031 as TaxTableJsonData,
  "2024/continente/2024-09-01_2024-10-31/CAS2D+DEF": cas2d_def_2024_continente_0901_1031 as TaxTableJsonData,
  "2024/continente/2024-09-01_2024-10-31/CAS1+DEF": cas1_def_2024_continente_0901_1031 as TaxTableJsonData,

  // 2024/continente/2024-11-01_2024-12-31
  "2024/continente/2024-11-01_2024-12-31/SOLD+DEF": sold_def_2024_continente_1101_1231 as TaxTableJsonData,
  "2024/continente/2024-11-01_2024-12-31/SOLD": sold_2024_continente_1101_1231 as TaxTableJsonData,
  "2024/continente/2024-11-01_2024-12-31/CAS2D+DEF": cas2d_def_2024_continente_1101_1231 as TaxTableJsonData,
  "2024/continente/2024-11-01_2024-12-31/SOLCAS2+DEF": solcas2_def_2024_continente_1101_1231 as TaxTableJsonData,
  "2024/continente/2024-11-01_2024-12-31/SOLCAS2": solcas2_2024_continente_1101_1231 as TaxTableJsonData,
  "2024/continente/2024-11-01_2024-12-31/CAS1+DEF": cas1_def_2024_continente_1101_1231 as TaxTableJsonData,
  "2024/continente/2024-11-01_2024-12-31/CAS1": cas1_2024_continente_1101_1231 as TaxTableJsonData,

  // 2024/madeira/2024-01-01_2024-08-31
  "2024/madeira/2024-01-01_2024-08-31/SOLCAS2": solcas2_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/SOLD+DEF": sold_def_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/SOLD": sold_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/SOLCAS2+DEF": solcas2_def_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/CAS2D+DEF": cas2d_def_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/CAS2D": cas2d_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/CAS1D+DEF": cas1d_def_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/CAS1D": cas1d_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/CAS1+DEF": cas1_def_2024_madeira_0101_0831 as TaxTableJsonData,
  "2024/madeira/2024-01-01_2024-08-31/CAS1": cas1_2024_madeira_0101_0831 as TaxTableJsonData,

  // 2024/madeira/2024-09-01_2024-10-31
  "2024/madeira/2024-09-01_2024-10-31/SOLD": sold_2024_madeira_0901_1031 as TaxTableJsonData,
  "2024/madeira/2024-09-01_2024-10-31/SOLCAS2": solcas2_2024_madeira_0901_1031 as TaxTableJsonData,
  "2024/madeira/2024-09-01_2024-10-31/SOLD+DEF": sold_def_2024_madeira_0901_1031 as TaxTableJsonData,
  "2024/madeira/2024-09-01_2024-10-31/CAS1": cas1_2024_madeira_0901_1031 as TaxTableJsonData,
  "2024/madeira/2024-09-01_2024-10-31/CAS2D+DEF": cas2d_def_2024_madeira_0901_1031 as TaxTableJsonData,
  "2024/madeira/2024-09-01_2024-10-31/SOLCAS2+DEF": solcas2_def_2024_madeira_0901_1031 as TaxTableJsonData,
  "2024/madeira/2024-09-01_2024-10-31/CAS1+DEF": cas1_def_2024_madeira_0901_1031 as TaxTableJsonData,

  // 2024/madeira/2024-11-01_2024-12-31
  "2024/madeira/2024-11-01_2024-12-31/SOLD+DEF": sold_def_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/SOLD": sold_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/SOLCAS2+DEF": solcas2_def_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/SOLCAS2": solcas2_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/CAS2D": cas2d_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/CAS1D": cas1d_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/CAS2D+DEF": cas2d_def_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/CAS1": cas1_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/CAS1D+DEF": cas1d_def_2024_madeira_1101_1231 as TaxTableJsonData,
  "2024/madeira/2024-11-01_2024-12-31/CAS1+DEF": cas1_def_2024_madeira_1101_1231 as TaxTableJsonData,
};

// Helper type for stronger typing if needed elsewhere
export type TaxTablesManifest = typeof taxTablesData;
