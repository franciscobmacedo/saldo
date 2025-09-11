import * as fs from 'fs';
import * as path from 'path';

// Helper function to generate import name from file path
function generateImportName(region: string, dateRange: string, fileName: string): string {
  const year = dateRange.split('_')[0].split('-')[0]; // Extract year from date range
  const dateRangePart = dateRange.replace(/[_-]/g, ''); // Remove dashes and underscores
  const fileNamePart = fileName.replace(/[+.]/g, '_').replace('json', '').replace(/__$/, ''); // Clean filename
  
  return `${fileNamePart}_${year}_${region}_${dateRangePart}`.toLowerCase();
}

// Helper function to generate key from file path
function generateKey(region: string, dateRange: string, fileName: string): string {
  const year = dateRange.split('_')[0].split('-')[0]; // Extract year from date range  
  const fileNameWithoutExt = fileName.replace('.json', '');
  return `${year}/${region}/${dateRange}/${fileNameWithoutExt}`;
}

function updateManifest() {
  const basePath = path.join(__dirname, '../src/data/retention-tax-tables/2025');
  const manifestPath = path.join(__dirname, '../src/data/retention-tax-tables-data.ts');
  
  // Read current manifest
  const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
  
  // Find regions in 2025 directory
  const regions = fs.readdirSync(basePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== '2025' && dirent.name !== 'raw') // Exclude raw and other non-region directories
    .map(dirent => dirent.name);
  
  let newImports: string[] = [];
  let newExports: string[] = [];
  
  // Process each region
  for (const region of regions) {
    const regionPath = path.join(basePath, region);
    
    // Get date ranges for this region
    const dateRanges = fs.readdirSync(regionPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const dateRange of dateRanges) {
      const dateRangePath = path.join(regionPath, dateRange);
      
      // Get JSON files in this date range
      const jsonFiles = fs.readdirSync(dateRangePath)
        .filter(file => file.endsWith('.json'));
      
      for (const jsonFile of jsonFiles) {
        const importName = generateImportName(region, dateRange, jsonFile);
        const key = generateKey(region, dateRange, jsonFile);
        const importPath = `./retention-tax-tables/2025/${region}/${dateRange}/${jsonFile}`;
        
        newImports.push(`import ${importName} from '${importPath}';`);
        newExports.push(`  "${key}": ${importName} as TaxTableJsonData,`);
      }
    }
  }
  
  // Find the end of existing imports section
  const endImportsComment = '// --- END IMPORTS ---';
  const endImportsIndex = manifestContent.indexOf(endImportsComment);
  
  if (endImportsIndex === -1) {
    throw new Error('Could not find end imports comment in manifest file');
  }
  
  // Insert new imports before the end imports comment
  const beforeEndImports = manifestContent.substring(0, endImportsIndex);
  const afterEndImports = manifestContent.substring(endImportsIndex);
  
  const importsSection = `
// 2025 imports
${newImports.join('\n')}

`;
  
  const updatedImportsSection = beforeEndImports + importsSection + afterEndImports;
  
  // Find the end of the taxTablesData object
  const taxTablesDataStart = 'export const taxTablesData: Record<string, TaxTableJsonData> = {';
  const taxTablesDataStartIndex = updatedImportsSection.indexOf(taxTablesDataStart);
  
  if (taxTablesDataStartIndex === -1) {
    throw new Error('Could not find taxTablesData declaration in manifest file');
  }
  
  // Find the closing brace of the taxTablesData object
  const closingBracePattern = /^};$/m;
  const closingBraceMatch = updatedImportsSection.match(closingBracePattern);
  
  if (!closingBraceMatch || !closingBraceMatch.index) {
    throw new Error('Could not find closing brace of taxTablesData object');
  }
  
  const beforeClosingBrace = updatedImportsSection.substring(0, closingBraceMatch.index);
  const afterClosingBrace = updatedImportsSection.substring(closingBraceMatch.index);
  
  const exportsSection = `
  // 2025 data
${newExports.join('\n')}
`;
  
  const finalContent = beforeClosingBrace + exportsSection + '\n' + afterClosingBrace;
  
  // Write updated manifest
  fs.writeFileSync(manifestPath, finalContent, 'utf-8');
  
  console.log('Manifest updated successfully!');
  console.log(`Added ${newImports.length} imports and ${newExports.length} exports for 2025 data.`);
}

updateManifest(); 