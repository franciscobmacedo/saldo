import * as fs from 'fs';
import * as path from 'path';

// Configuration options
const CONFIG = {
  // Set to false to skip pensioner tables, true to include them
  includePensionerTables: false
};

// Raw data structure from the split files
interface RawTaxTable {
  index: string;
  title: string;
  table: string;
  values: string[][];
  job_type: string;
  marital_status: string;
  dependents: number;
  incapacity: boolean;
  region: string;
  originalRegion: string;
  fileName: string;
}

// Target structure for the converted JSON files
interface TaxBracket {
  signal: "max" | "min";
  limit: number;
  max_marginal_rate: number;
  deduction: number;
  var1_deduction: number;
  var2_deduction: number;
  dependent_aditional_deduction: number;
  effective_mensal_rate: number;
}

interface ConvertedTaxTable {
  situation: string;
  title: string;
  table: string;
  description: string;
  brackets: TaxBracket[];
  dependent_disabled_addition_deduction?: number;
}

// Function to parse monetary values (removes € symbol and converts to number)
function parseMonetaryValue(value: string): number {
  if (!value || value === "n.a." || value === "0,00 €") {
    return 0;
  }
  
  // Remove € symbol and replace comma with dot for decimal separator
  const cleanValue = value.replace(/[€\s]/g, '').replace(',', '.');
  const num = parseFloat(cleanValue);
  return isNaN(num) ? 0 : num;
}

// Function to parse percentage values
function parsePercentageValue(value: string): number {
  if (!value || value === "n.a." || value === "0.00%") {
    return 0;
  }
  
  // Remove % symbol and replace comma with dot
  const cleanValue = value.replace('%', '').replace(',', '.');
  const num = parseFloat(cleanValue);
  return isNaN(num) ? 0 : num / 100; // Convert to decimal
}

// Function to parse complex deduction formulas
function parseDeduction(deductionStr: string): { deduction: number; var1: number; var2: number } {
  if (!deductionStr || deductionStr === "0,00 €") {
    return { deduction: 0, var1: 0, var2: 0 };
  }

  // Handle simple monetary values
  if (deductionStr.includes('€') && !deductionStr.includes('*') && !deductionStr.includes('%')) {
    return { deduction: parseMonetaryValue(deductionStr), var1: 0, var2: 0 };
  }

  // Handle formulas like "13,00% * 2.6 * (1208,32 - R)"
  const formulaMatch = deductionStr.match(/([0-9,]+)%\s*\*\s*([0-9,.]+)\s*\*\s*\(([0-9,]+)\s*-\s*R\)/);
  if (formulaMatch) {
    const rate = parseFloat(formulaMatch[1].replace(',', '.')) / 100;
    const multiplier = parseFloat(formulaMatch[2].replace(',', '.'));
    const constant = parseFloat(formulaMatch[3].replace(',', '.'));
    
    console.log(`    Parsed formula: ${deductionStr} -> rate=${rate}, var1=${multiplier}, var2=${constant}`);
    return { deduction: rate, var1: multiplier, var2: constant };
  }

  // Fallback: try to parse as monetary value
  console.log(`    Using fallback for deduction: ${deductionStr}`);
  return { deduction: parseMonetaryValue(deductionStr), var1: 0, var2: 0 };
}

// Function to generate description based on situation code and properties
function generateDescription(table: RawTaxTable): string {
  const jobTypeMap: { [key: string]: string } = {
    'employee': 'Trabalho dependente',
    'pensioner': 'Pensões'
  };

  const maritalStatusMap: { [key: string]: string } = {
    'single': 'Não casado',
    'married_single': 'Casado único titular',
    'married_double': 'Casado dois titulares'
  };

  const jobType = jobTypeMap[table.job_type] || table.job_type;
  const maritalStatus = maritalStatusMap[table.marital_status] || table.marital_status;
  
  let description = `${jobType}, ${maritalStatus}`;
  
  if (table.dependents > 0) {
    description += `, com ${table.dependents === 1 ? 'um' : 'mais'} dependente${table.dependents > 1 ? 's' : ''}`;
  }
  else {
    description += ', sem dependentes';
  }
  
  if (table.incapacity) {
    description += ' - Deficiente';
  }

  return description;
}

// Function to convert raw table to structured format
function convertRawTable(rawTable: RawTaxTable): ConvertedTaxTable {
  console.log(`  Converting ${rawTable.fileName} (${rawTable.index})`);
  const brackets: TaxBracket[] = [];
  
  for (const [rangeStr, rateStr, deductionStr, effectiveRateStr] of rawTable.values) {
    console.log(`    Processing bracket: ${rangeStr} | ${rateStr} | ${deductionStr} | ${effectiveRateStr}`);
    
    // Parse the range to get limit and signal
    let limit: number;
    let signal: "max" | "min";
    
    if (rangeStr.startsWith("até ")) {
      // "até 870,00 €" -> max bracket with limit 870
      limit = parseMonetaryValue(rangeStr.replace("até ", ""));
      signal = "max";
    } else if (rangeStr.startsWith("mais de ")) {
      // "mais de 20 221,00 €" -> min bracket with limit 20221
      limit = parseMonetaryValue(rangeStr.replace("mais de ", ""));
      signal = "min";
    } else {
      console.warn(`    Unknown range format: ${rangeStr}`);
      continue;
    }

    // Parse the tax rate
    const maxMarginalRate = parsePercentageValue(rateStr);
    
    // Parse the deduction (which can be a formula or simple value)
    const { deduction, var1: var1Deduction, var2: var2Deduction } = parseDeduction(deductionStr);
    
    // Parse effective monthly rate
    const effectiveMensalRate = effectiveRateStr === "n.a." ? -1 : parsePercentageValue(effectiveRateStr);

    console.log(`    -> signal=${signal}, limit=${limit}, rate=${maxMarginalRate}, deduction=${deduction}, effective=${effectiveMensalRate}`);

    brackets.push({
      signal,
      limit,
      max_marginal_rate: maxMarginalRate,
      deduction,
      var1_deduction: var1Deduction,
      var2_deduction: var2Deduction,
      dependent_aditional_deduction: 0, // Will be set based on table type
      effective_mensal_rate: effectiveMensalRate
    });
  }

  // Set dependent additional deduction based on situation
  // These values are based on patterns observed in 2024 data
  const dependentDeductions: { [key: string]: number } = {
    'SOLD': 31.43,
    'SOLD+DEF': 84.82,
    'SOLCAS2': 21.43,
    'SOLCAS2+DEF': 84.82,
    'CAS1': 21.43,
    'CAS1+DEF': 84.82,
    'CAS2D+DEF': 84.82,
    'CAS1D': 34.29,
    'CAS1D+DEF': 84.82,
    'CAS2D': 34.29
  };

  // Extract base index (remove _EMP/_PEN suffix if present)
  const baseIndex = rawTable.index.replace(/_EMP$|_PEN$/, '');
  const dependentDeduction = dependentDeductions[baseIndex] || 34.29;
  
  // Update all brackets with the dependent deduction
  brackets.forEach(bracket => {
    bracket.dependent_aditional_deduction = dependentDeduction;
  });

  const converted = {
    situation: rawTable.index,
    title: rawTable.title,
    table: rawTable.table,
    description: generateDescription(rawTable),
    brackets,
    dependent_disabled_addition_deduction: rawTable.incapacity ? 84.82 : undefined
  };

  console.log(`  -> Generated ${brackets.length} brackets for ${rawTable.index}`);
  return converted;
}

// Main conversion function
function convertSplitTables() {
  const rawBasePath = path.join(__dirname, '../src/data/retention-tax-tables/2025/raw');
  const outputBasePath = path.join(__dirname, '../src/data/retention-tax-tables/2025');

  const regions = ['continente', 'acores', 'madeira'];

  console.log('Converting split table files to final format...');

  for (const region of regions) {
    console.log(`\nProcessing region: ${region}`);
    
    const regionRawPath = path.join(rawBasePath, region);
    const regionOutputPath = path.join(outputBasePath, region);
    
    if (!fs.existsSync(regionRawPath)) {
      console.warn(`Raw folder for ${region} does not exist: ${regionRawPath}`);
      continue;
    }

    // Create output region directory
    if (!fs.existsSync(regionOutputPath)) {
      fs.mkdirSync(regionOutputPath, { recursive: true });
    }

    // For 2025, we'll create a single date range covering the entire year
    const dateRangePath = path.join(regionOutputPath, '2025-01-01_2025-12-31');
    if (!fs.existsSync(dateRangePath)) {
      fs.mkdirSync(dateRangePath, { recursive: true });
    }

    // Read all JSON files in the region raw folder
    const files = fs.readdirSync(regionRawPath).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} table files`);

    for (const file of files) {
      const filePath = path.join(regionRawPath, file);
      
      try {
        // Read the raw table
        const rawTableContent = fs.readFileSync(filePath, 'utf-8');
        const rawTable: RawTaxTable = JSON.parse(rawTableContent);
        
        // Skip pension tables for now (as in original script)
        if (rawTable.job_type === 'pensioner' && !CONFIG.includePensionerTables) {
          console.log(`  Skipping pension table: ${file}`);
          continue;
        }

        // Convert the table
        const convertedTable = convertRawTable(rawTable);
        
        // Determine output filename - remove _EMP suffix if we're not including pensioner tables
        let outputFileName = file;
        if (!CONFIG.includePensionerTables && file.endsWith('_EMP.json')) {
          outputFileName = file.replace('_EMP.json', '.json');
        }
        const outputFile = path.join(dateRangePath, outputFileName);
        
        fs.writeFileSync(outputFile, JSON.stringify(convertedTable, null, 2), 'utf-8');
        console.log(`  ✓ Created: ${region}/2025-01-01_2025-12-31/${file}`);
        
      } catch (error) {
        console.error(`  ✗ Error processing ${file}:`, error);
      }
    }
  }

  console.log('\nConversion completed!');
}

// Run the conversion
convertSplitTables(); 