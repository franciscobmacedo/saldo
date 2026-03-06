import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const buildInfo = {
  version: pkg.version,
  timestamp: new Date().toISOString(),
};

const content = `// This file is generated. Do not edit.
export const buildInfo = ${JSON.stringify(buildInfo, null, 2)} as const;
`;

const outputPath = path.resolve(__dirname, '../src/build-info.ts');
fs.writeFileSync(outputPath, content);
console.log('Build info generated:', buildInfo);
