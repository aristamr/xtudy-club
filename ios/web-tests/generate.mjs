// Genera los scripts exactamente como los compone PresenteCore (swift run presente-script).
// Si no hay toolchain de Swift (p. ej. CI sin Swift), define PRESENTE_SWIFT con otro comando.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..', 'Packages', 'PresenteCore');
const out = join(here, 'generated');
mkdirSync(out, { recursive: true });

const variants = {
  'instagram': ['instagram'],
  'instagram-no-recommendations': ['instagram', 'recommendations'],
  'youtube': ['youtube'],
  'youtube-no-recommendations': ['youtube', 'recommendations'],
  'tiktok': ['tiktok'],
  'facebook': ['facebook'],
  'x': ['x'],
  'reddit': ['reddit'],
  'linkedin': ['linkedin'],
  'threads': ['threads'],
  'pinterest': ['pinterest'],
};

const swift = process.env.PRESENTE_SWIFT || 'swift';
for (const [name, args] of Object.entries(variants)) {
  const script = execFileSync(swift, ['run', '--package-path', pkg, '-c', 'debug', 'presente-script', ...args], { encoding: 'utf8' });
  writeFileSync(join(out, name + '.js'), script);
  console.log('generated', name);
}
