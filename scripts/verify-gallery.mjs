import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {
  buildGallerySchema,
  galleryDescription,
  galleryUrl,
  readGalleryCatalog,
} from './gallery-schema.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(new URL('../apps/docs/dist/index.html', import.meta.url), 'utf8');
const matches = [
  ...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
];
assert.equal(matches.length, 1, 'Expected one build-time JSON-LD graph');
const catalog = await readGalleryCatalog(root);
const manifest = JSON.parse(
  await readFile(new URL('../packages/ui/package.json', import.meta.url), 'utf8'),
);
assert.ok(
  catalog.every((demo) => !demo.release || demo.release !== 'next'),
  'Every gallery component must be available in the published npm version',
);
assert.ok(
  catalog.every((demo) => !demo.release || demo.release === manifest.version),
  'New component badges must match the package being released',
);
const schema = JSON.parse(matches[0][1]);
assert.deepEqual(
  schema,
  buildGallerySchema(catalog),
  'Built schema must match the rendered catalog metadata',
);
assert.ok(html.includes(`href="${galleryUrl}"`), 'Canonical must point to the public gallery');
assert.ok(html.includes(galleryDescription), 'Description must match the collection schema');
const exportedSource = await readFile(
  new URL('../packages/ui/src/index.ts', import.meta.url),
  'utf8',
);
const exported = new Set();
for (const statement of ts.createSourceFile(
  'index.ts',
  exportedSource,
  ts.ScriptTarget.Latest,
  true,
).statements) {
  if (
    ts.isExportDeclaration(statement) &&
    statement.exportClause &&
    ts.isNamedExports(statement.exportClause)
  ) {
    for (const item of statement.exportClause.elements) exported.add(item.name.text);
  }
}
// Toast is exposed through its public hook/provider API rather than a Toast JSX export.
const publicApi = { Toast: 'useToast' };
for (const demo of catalog)
  assert.ok(
    exported.has(publicApi[demo.name] ?? demo.name),
    `${demo.name} must use a public library export`,
  );
const list = schema['@graph'].find((item) => item['@type'] === 'ItemList');
assert.equal(list.numberOfItems, catalog.length);
assert.ok(list.itemListElement.every((item, index) => item.position === index + 1));
console.log(
  `Gallery verified: ${catalog.length} actual component exports; build-time JSON-LD, metadata, canonical and example links match.`,
);
