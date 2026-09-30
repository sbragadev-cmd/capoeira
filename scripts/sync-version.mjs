import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;

fs.writeFileSync(
  path.join(root, 'src', 'version.js'),
  `// Gerado automaticamente. Não editar manualmente.\nwindow.APP_VERSION = '${version}';\n`
);

fs.writeFileSync(
  path.join(root, 'version.json'),
  JSON.stringify({ version, generatedAt: new Date().toISOString() }, null, 2) + '\n'
);

const swTemplate = fs.readFileSync(path.join(root, 'sw.template.js'), 'utf8');
fs.writeFileSync(path.join(root, 'sw.js'), swTemplate.replaceAll('__APP_VERSION__', version));

console.log(`Versão sincronizada: ${version}`);
