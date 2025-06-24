import * as fs from 'fs';
import * as path from 'path';

// Raw data structure from the 2025/raw.json file
interface RawTaxTable {
  index: string;
  title: string;
  table: string;
  values: string[][];
  job_type: string;
  marital_status: string;
  dependents: number;
  incapacity: boolean;
}

interface RawData {
  portugal_continental: RawTaxTable[];
  acores: RawTaxTable[];
  madeira: RawTaxTable[];
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
    
    return { deduction: rate, var1: multiplier, var2: constant };
  }

  // Handle formulas like "16,50% * 1.35 * (1477,67 - R)"
  const formula2Match = deductionStr.match(/([0-9,]+)%\s*\*\s*([0-9,.]+)\s*\*\s*\(([0-9,]+)\s*-\s*R\)/);
  if (formula2Match) {
    const rate = parseFloat(formula2Match[1].replace(',', '.')) / 100;
    const multiplier = parseFloat(formula2Match[2].replace(',', '.'));
    const constant = parseFloat(formula2Match[3].replace(',', '.'));
    
    return { deduction: rate, var1: multiplier, var2: constant };
  }

  // Fallback: try to parse as monetary value
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
  
  let description = `${jobType} - ${maritalStatus}`;
  
  if (table.dependents > 0) {
    description += ` com ${table.dependents === 1 ? 'um' : 'mais'} dependente${table.dependents > 1 ? 's' : ''}`;
  }
  
  if (table.incapacity) {
    description += ' - Deficiente';
  }

  return description;
}

// Function to convert raw table to structured format
function convertRawTable(rawTable: RawTaxTable): ConvertedTaxTable {
  const brackets: TaxBracket[] = [];
  
  for (const [rangeStr, rateStr, deductionStr, effectiveRateStr] of rawTable.values) {
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
      console.warn(`Unknown range format: ${rangeStr}`);
      continue;
    }

    // Parse the tax rate
    const maxMarginalRate = parsePercentageValue(rateStr);
    
    // Parse the deduction (which can be a formula or simple value)
    const { deduction, var1: var1Deduction, var2: var2Deduction } = parseDeduction(deductionStr);
    
    // Parse effective monthly rate
    const effectiveMensalRate = effectiveRateStr === "n.a." ? -1 : parsePercentageValue(effectiveRateStr);

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
    'SOLD': 34.29,
    'SOLD+DEF': 84.82,
    'SOLCAS2': 34.29,
    'SOLCAS2+DEF': 84.82,
    'CAS1': 34.29,
    'CAS1+DEF': 84.82,
    'CAS2D+DEF': 84.82,
    'CAS1D': 34.29,
    'CAS1D+DEF': 84.82,
    'CAS2D': 34.29
  };

  const dependentDeduction = dependentDeductions[rawTable.index] || 34.29;
  
  // Update all brackets with the dependent deduction
  brackets.forEach(bracket => {
    bracket.dependent_aditional_deduction = dependentDeduction;
  });

  return {
    situation: rawTable.index,
    description: generateDescription(rawTable),
    brackets,
    dependent_disabled_addition_deduction: rawTable.incapacity ? 84.82 : undefined
  };
}

// Main conversion function
function convertRawData() {
  const rawDataPath = path.join(__dirname, '../src/data/retention-tax-tables/2025/raw.json');
  const outputBasePath = path.join(__dirname, '../src/data/retention-tax-tables/2025');

  // Read the raw data
  const rawDataContent = fs.readFileSync(rawDataPath, 'utf-8');
  const rawData: RawData = JSON.parse(rawDataContent);

  // Region mapping
  const regionMapping: { [key: string]: string } = {
    'portugal_continental': 'continente',
    'acores': 'acores',
    'madeira': 'madeira'
  };

  // Process each region
  for (const [rawRegionName, tables] of Object.entries(rawData)) {
    const regionName = regionMapping[rawRegionName];
    if (!regionName) {
      console.warn(`Unknown region: ${rawRegionName}`);
      continue;
    }

    // Create region directory
    const regionPath = path.join(outputBasePath, regionName);
    if (!fs.existsSync(regionPath)) {
      fs.mkdirSync(regionPath, { recursive: true });
    }

    // For 2025, we'll create a single date range covering the entire year
    const dateRangePath = path.join(regionPath, '2025-01-01_2025-12-31');
    if (!fs.existsSync(dateRangePath)) {
      fs.mkdirSync(dateRangePath, { recursive: true });
    }

    // Convert and save each table
    for (const rawTable of tables) {
      const convertedTable = convertRawTable(rawTable);
      const fileName = `${rawTable.index}.json`;
      const filePath = path.join(dateRangePath, fileName);
      
      fs.writeFileSync(filePath, JSON.stringify(convertedTable, null, 2), 'utf-8');
      console.log(`Created: ${filePath}`);
    }
  }

  console.log('Conversion completed!');
}

// Run the conversion
convertRawData(); 