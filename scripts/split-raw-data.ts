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

function splitRawData() {
  const rawDataPath = path.join(__dirname, '../src/data/retention-tax-tables/2025/raw/raw.json');
  const rawFolderPath = path.join(__dirname, '../src/data/retention-tax-tables/2025/raw');

  // Read the raw data
  const rawDataContent = fs.readFileSync(rawDataPath, 'utf-8');
  const rawData: RawData = JSON.parse(rawDataContent);

  // Region mapping
  const regionMapping: { [key: string]: string } = {
    'portugal_continental': 'continente',
    'acores': 'acores',
    'madeira': 'madeira'
  };

  console.log('Splitting raw data into individual table files...');

  // Process each region
  for (const [rawRegionName, tables] of Object.entries(rawData)) {
    const regionName = regionMapping[rawRegionName];
    if (!regionName) {
      console.warn(`Unknown region: ${rawRegionName}`);
      continue;
    }

    console.log(`\nProcessing region: ${regionName}`);
    console.log(`Found ${tables.length} tables`);

    // Create region subfolder in raw
    const regionRawPath = path.join(rawFolderPath, regionName);
    if (!fs.existsSync(regionRawPath)) {
      fs.mkdirSync(regionRawPath, { recursive: true });
    }

    // Count table indexes to handle duplicates
    const indexCounts: { [index: string]: { count: number; jobTypes: Set<string> } } = {};
    for (const table of tables) {
      if (!indexCounts[table.index]) {
        indexCounts[table.index] = { count: 0, jobTypes: new Set() };
      }
      indexCounts[table.index].count++;
      indexCounts[table.index].jobTypes.add(table.job_type);
    }

    // Save each table as individual file
    for (const rawTable of tables) {
      // Generate filename - include job_type suffix if there are duplicates with different job_types
      let fileName: string;
      const indexInfo = indexCounts[rawTable.index];
      if (indexInfo.count > 1 && indexInfo.jobTypes.size > 1) {
        // There are multiple tables with same index but different job_types
        const jobTypeSuffix = rawTable.job_type === 'employee' ? '_EMP' : '_PEN';
        fileName = `${rawTable.index}${jobTypeSuffix}.json`;
      } else {
        fileName = `${rawTable.index}.json`;
      }

      const filePath = path.join(regionRawPath, fileName);
      
      // Add some metadata for debugging
      const tableWithMetadata = {
        ...rawTable,
        region: regionName,
        originalRegion: rawRegionName,
        fileName: fileName
      };
      
      fs.writeFileSync(filePath, JSON.stringify(tableWithMetadata, null, 2), 'utf-8');
      console.log(`  Created: ${regionName}/${fileName} (${rawTable.job_type}, ${rawTable.marital_status}, deps: ${rawTable.dependents}, incapacity: ${rawTable.incapacity})`);
    }
  }

  console.log('\nRaw data splitting completed!');
}

// Run the splitting
splitRawData(); 