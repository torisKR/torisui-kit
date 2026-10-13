import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// This verifier installs a packed artifact outside the workspace. It does not
// publish anything, evaluate gallery React code, or import library source files.
const root = fileURLToPath(new URL('../', import.meta.url));
const catalogs = [
  ['apps/docs/src/demos.tsx', 'demos'],
  ['apps/docs/src/demos-input-extra.tsx', 'inputExtraDemos'],
  ['apps/docs/src/demos-display-extra.tsx', 'displayExtraDemos'],
];
const newExports = [
  'NumberInput',
  'SegmentedControl',
  'Stepper',
  'TagInput',
  'Meter',
  'SearchInput',
  'CopyButton',
  'Chip',
  'Timeline',
  'AlertDialog',
];
const newSelectors = [
  '.tori-number-input',
  '.tori-segmented-control',
  '.tori-stepper',
  '.tori-tag-input',
  '.tori-meter-track',
  '.tori-search-input',
  '.tori-copy-button',
  '.tori-chip',
  '.tori-timeline',
  '.tori-alert-dialog',
];

function usage() {
  return 'Usage: node scripts/verify-package-examples.mjs /path/to/package.tgz [--offline] [--keep|--clean] [--expected-count 47] [--cache /path/to/npm-cache]';
}

function parseArgs(args) {
  const options = {
    archive: undefined,
    offline: false,
    keep: true,
    expectedCount: 47,
    cache: join(process.platform === 'darwin' ? '/private/tmp' : tmpdir(), 'torisui-npm-cache'),
  };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--offline') options.offline = true;
    else if (arg === '--keep') options.keep = true;
    else if (arg === '--clean') options.keep = false;
    else if (arg === '--expected-count' || arg === '--cache') {
      const next = args[++index];
      if (!next) throw new Error(`${arg} needs a value. ${usage()}`);
      if (arg === '--cache') options.cache = resolve(next);
      else {
        options.expectedCount = Number(next);
        if (!Number.isInteger(options.expectedCount) || options.expectedCount < 1)
          throw new Error('--expected-count must be a positive integer.');
      }
    } else if (arg.startsWith('-')) throw new Error(`Unknown option ${arg}. ${usage()}`);
    else if (options.archive) throw new Error(`Only one archive may be supplied. ${usage()}`);
    else options.archive = resolve(arg);
  }
  if (!options.archive) throw new Error(usage());
  return options;
}

// A deliberately limited AST interpreter extracts the exact strings generated
// by each catalog's local example() helper. Unexpected code fails closed rather
// than silently reconstructing a different snippet or executing source text.
function evaluate(node, environment, functions, sourceName) {
  const fail = () => {
    throw new Error(`${sourceName}: unsupported code-string expression: ${node.getText()}`);
  };
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) {
    if (!environment.has(node.text)) return fail();
    return environment.get(node.text);
  }
  if (ts.isTemplateExpression(node)) {
    return node.templateSpans.reduce(
      (text, span) =>
        text + evaluate(span.expression, environment, functions, sourceName) + span.literal.text,
      node.head.text,
    );
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return (
      evaluate(node.left, environment, functions, sourceName) +
      evaluate(node.right, environment, functions, sourceName)
    );
  }
  if (ts.isCallExpression(node)) {
    if (
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'trim' &&
      node.arguments.length === 0
    ) {
      return evaluate(node.expression.expression, environment, functions, sourceName).trim();
    }
    if (!ts.isIdentifier(node.expression)) return fail();
    const helper = functions.get(node.expression.text);
    if (
      !helper?.body ||
      helper.body.statements.length !== 1 ||
      !ts.isReturnStatement(helper.body.statements[0]) ||
      !helper.body.statements[0].expression
    )
      return fail();
    if (helper.parameters.length !== node.arguments.length) return fail();
    const parameters = new Map();
    for (let index = 0; index < helper.parameters.length; index++) {
      const name = helper.parameters[index].name;
      if (!ts.isIdentifier(name)) return fail();
      parameters.set(
        name.text,
        evaluate(node.arguments[index], environment, functions, sourceName),
      );
    }
    return evaluate(helper.body.statements[0].expression, parameters, functions, sourceName);
  }
  return fail();
}

async function extractExamples() {
  const groups = new Map();
  const knownNames = new Set(catalogs.map(([, name]) => name));
  for (const [path, arrayName] of catalogs) {
    const source = await readFile(resolve(root, path), 'utf8');
    const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.equal(
      file.parseDiagnostics.length,
      0,
      `${path} must parse before examples are extracted`,
    );
    const functions = new Map(
      file.statements
        .filter(ts.isFunctionDeclaration)
        .filter((statement) => statement.name)
        .map((statement) => [statement.name.text, statement]),
    );
    const declaration = file.statements
      .filter(ts.isVariableStatement)
      .flatMap((statement) => [...statement.declarationList.declarations])
      .find((item) => ts.isIdentifier(item.name) && item.name.text === arrayName);
    assert.ok(
      declaration?.initializer && ts.isArrayLiteralExpression(declaration.initializer),
      `${path}: expected literal ${arrayName}`,
    );
    const entries = [];
    for (const element of declaration.initializer.elements) {
      if (ts.isSpreadElement(element)) {
        assert.ok(
          ts.isIdentifier(element.expression) && knownNames.has(element.expression.text),
          `${path}: only known catalog spreads can be expanded`,
        );
        entries.push({ spread: element.expression.text });
        continue;
      }
      assert.ok(
        ts.isObjectLiteralExpression(element),
        `${path}: catalog entries must be literal objects`,
      );
      const properties = new Map(
        element.properties
          .filter(ts.isPropertyAssignment)
          .map((property) => [
            property.name.getText(file).replace(/^['"]|['"]$/g, ''),
            property.initializer,
          ]),
      );
      assert.ok(
        properties.has('id') && properties.has('name') && properties.has('code'),
        `${path}: every demo needs id, name, and code`,
      );
      const id = evaluate(properties.get('id'), new Map(), functions, path);
      const name = evaluate(properties.get('name'), new Map(), functions, path);
      const code = evaluate(properties.get('code'), new Map(), functions, path);
      assert.match(id, /^[a-z][a-z0-9-]*$/, `Invalid example ID in ${path}`);
      assert.equal(typeof code, 'string');
      assert.ok(code.trim().length > 0, `${id}: example is empty`);
      const snippet = ts.createSourceFile(
        `${id}.tsx`,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      assert.equal(snippet.parseDiagnostics.length, 0, `${id}: extracted TSX must parse`);
      const imports = snippet.statements
        .filter(ts.isImportDeclaration)
        .map((statement) => statement.moduleSpecifier.text);
      assert.ok(imports.includes('@toris-dev/ui'), `${id}: must use the public npm package`);
      assert.ok(
        imports.every((specifier) => !specifier.startsWith('.') && !isAbsolute(specifier)),
        `${id}: source-relative or absolute imports would bypass consumer verification`,
      );
      entries.push({ id, name, code, source: path });
    }
    groups.set(arrayName, entries);
  }
  const included = new Set();
  function expand(name, ancestors = []) {
    assert.ok(
      !ancestors.includes(name),
      `Circular catalog spread: ${[...ancestors, name].join(' -> ')}`,
    );
    assert.ok(groups.has(name), `Missing source catalog: ${name}`);
    included.add(name);
    return groups
      .get(name)
      .flatMap((entry) => (entry.spread ? expand(entry.spread, [...ancestors, name]) : entry));
  }
  // Follow the actual rendered root array's spread order, without counting each
  // extra array a second time simply because its source file was also read.
  const examples = expand('demos');
  for (const name of knownNames)
    assert.ok(included.has(name), `${name} must be composed into the rendered demos array`);
  assert.equal(
    new Set(examples.map((example) => example.id)).size,
    examples.length,
    'Example IDs must be unique',
  );
  for (const name of newExports)
    assert.ok(
      examples.some((example) => example.name === name),
      `${name}: new public family needs a real example`,
    );
  return examples;
}

async function installedVersion(specifier, from) {
  const require = createRequire(join(root, from, 'package.json'));
  return JSON.parse(await readFile(require.resolve(`${specifier}/package.json`), 'utf8')).version;
}

async function extractDocumentationExamples() {
  const examples = [];
  const skipped = [];
  for (const path of ['README.md', 'packages/ui/README.md']) {
    const markdown = await readFile(resolve(root, path), 'utf8');
    let block = 0;
    for (const match of markdown.matchAll(/```(tsx|jsx)\s*\n([\s\S]*?)\n```/g)) {
      block++;
      const code = match[2];
      const id = `${path === 'README.md' ? 'root' : 'package'}-readme-${block}`;
      const file = ts.createSourceFile(
        `${id}.tsx`,
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const imports = file.statements
        .filter(ts.isImportDeclaration)
        .map((statement) => statement.moduleSpecifier.text);
      // Complete examples supply a package import and an exported component or
      // function. Fragments are reported rather than completed with invented code.
      const exportedComponent = file.statements.some(
        (statement) =>
          (ts.isFunctionDeclaration(statement) || ts.isVariableStatement(statement)) &&
          statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
      );
      if (!imports.includes('@toris-dev/ui') || !exportedComponent) {
        skipped.push({
          id,
          source: path,
          reason: 'Partial snippet: needs a public-package import and exported component/function.',
        });
        continue;
      }
      assert.equal(
        file.parseDiagnostics.length,
        0,
        `${path} block ${block}: complete TSX must parse`,
      );
      assert.ok(
        imports.every((specifier) => !specifier.startsWith('.') && !isAbsolute(specifier)),
        `${id}: README examples must use public consumer dependencies`,
      );
      examples.push({ id, name: 'README example', source: path, code });
    }
  }
  return { examples, skipped };
}

async function writeBrowserFixture(consumer, examples, version) {
  const imports = examples
    .map((example, index) => `import Example${index} from './examples/${example.id}';`)
    .join('\n');
  const entries = examples
    .map(
      ({ id, name }, index) =>
        `{ id: ${JSON.stringify(id)}, name: ${JSON.stringify(name)}, component: Example${index} }`,
    )
    .join(',\n');
  const main = `import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ToriProvider } from '@toris-dev/ui';
import '@toris-dev/ui/styles.css';
${imports}

const examples = [${entries}];
function Consumer() {
  const [selected, setSelected] = React.useState('number-input');
  const [reset, setReset] = React.useState(0);
  const example = examples.find((item) => item.id === selected) ?? examples[0]!;
  const Component = example.component;
  return <ToriProvider theme="light"><main>
    <h1>Packed npm consumer · ${version}</h1>
    <p>실제 tarball 설치본 · 갤러리 예시 {examples.length}개</p>
    <label htmlFor="example">컴포넌트 예시</label>
    <select id="example" value={selected} onChange={(event) => setSelected(event.target.value)}>
      {examples.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.id})</option>)}
    </select>
    <button type="button" onClick={() => setReset(reset + 1)}>예시 초기화</button>
    <section aria-label={example.name + ' 예시'} key={selected + reset}><Component /></section>
  </main></ToriProvider>;
}
createRoot(document.getElementById('root')!).render(<Consumer />);
`;
  await writeFile(join(consumer, 'main.tsx'), main);
  await writeFile(
    join(consumer, 'index.html'),
    `<!doctype html>
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Packed TorisUI consumer</title>
<style>body{margin:0;background:#f8fafb;font:14px system-ui,sans-serif;color:#172027}main{max-width:760px;margin:40px auto;padding:24px}h1{font-size:22px}label{display:block;margin:20px 0 8px}select,main>button{font:inherit;min-height:44px;padding:8px 12px;margin-right:8px}section{margin-top:24px;padding:28px;background:white;border:1px solid #dbe1e6;border-radius:12px;min-height:180px;overflow-wrap:anywhere}section p{line-height:1.7}@media(max-width:500px){main{margin:12px auto;padding:12px}section{padding:16px}select{max-width:100%}}</style>
</head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>\n`,
  );
}

function run(command, args, cwd) {
  return new Promise((resolveRun, reject) => {
    // NODE_PATH must not make the isolated consumer accidentally use workspace deps.
    const environment = { ...process.env };
    delete environment.NODE_PATH;
    const child = spawn(command, args, {
      cwd,
      env: environment,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });
    let output = '';
    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`${command} failed (${code}) in ${cwd}\n${output}`));
      else resolveRun(output.trim());
    });
  });
}

const options = parseArgs(process.argv.slice(2));
const archive = await realpath(options.archive);
assert.ok((await stat(archive)).isFile() && archive.endsWith('.tgz'), 'Provide a packed .tgz file');
const examples = await extractExamples();
assert.equal(
  examples.length,
  options.expectedCount,
  `Expected ${options.expectedCount} actual gallery examples`,
);
const documentation = await extractDocumentationExamples();
const consumer = await mkdtemp(
  join(process.platform === 'darwin' ? '/private/tmp' : tmpdir(), 'torisui-consumer-'),
);
let succeeded = false;
try {
  await copyFile(archive, join(consumer, 'package.tgz'));
  const [react, reactDom, reactTypes, reactDomTypes, typescript] = await Promise.all([
    installedVersion('react', 'apps/docs'),
    installedVersion('react-dom', 'apps/docs'),
    installedVersion('@types/react', 'apps/docs'),
    installedVersion('@types/react-dom', 'apps/docs'),
    installedVersion('typescript', '.'),
  ]);
  await writeFile(
    join(consumer, 'package.json'),
    JSON.stringify(
      {
        name: 'torisui-packed-consumer-verification',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { '@toris-dev/ui': 'file:./package.tgz', react, 'react-dom': reactDom },
        devDependencies: {
          '@types/react': reactTypes,
          '@types/react-dom': reactDomTypes,
          typescript,
        },
      },
      null,
      2,
    ) + '\n',
  );
  const installArgs = [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--registry=https://registry.npmjs.org',
    '--cache',
    options.cache,
  ];
  if (options.offline) installArgs.push('--offline');
  console.log(
    `Extracted ${examples.length} real gallery TSX strings and ${documentation.examples.length} complete README examples; installing packed consumer in ${consumer}`,
  );
  for (const skipped of documentation.skipped)
    console.log(`SKIP ${skipped.source} (${skipped.id}): ${skipped.reason}`);
  const installOutput = await run(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    installArgs,
    consumer,
  );
  if (installOutput) console.log(installOutput);
  const installedRoot = await realpath(join(consumer, 'node_modules/@toris-dev/ui'));
  assert.ok(
    !relative(consumer, installedRoot).startsWith('..'),
    'Packed package must be installed inside the isolated consumer',
  );
  assert.ok(
    !installedRoot.startsWith(resolve(root, 'packages/ui')),
    'Consumer must not resolve workspace source',
  );
  const installedPackage = JSON.parse(await readFile(join(installedRoot, 'package.json'), 'utf8'));
  assert.equal(installedPackage.name, '@toris-dev/ui', 'Archive must contain @toris-dev/ui');
  const consumerRequire = createRequire(join(consumer, 'package.json'));
  const cssPath = await realpath(consumerRequire.resolve('@toris-dev/ui/styles.css'));
  assert.ok(
    !relative(installedRoot, cssPath).startsWith('..'),
    'CSS export must resolve inside the installed package',
  );
  const css = await readFile(cssPath, 'utf8');
  assert.ok(
    css.includes('--tori-primary') && css.includes('.tori-btn'),
    'Packed CSS must include core tokens and components',
  );
  for (const selector of newSelectors)
    assert.ok(css.includes(selector), `Packed CSS is missing ${selector}`);
  await mkdir(join(consumer, 'examples'));
  for (const example of [...examples, ...documentation.examples])
    await writeFile(join(consumer, 'examples', `${example.id}.tsx`), example.code + '\n');
  await writeBrowserFixture(consumer, examples, installedPackage.version);
  await writeFile(
    join(consumer, 'exports.ts'),
    `import { ${newExports.join(', ')} } from '@toris-dev/ui';\nexport const extensions = [${newExports.join(', ')}];\nimport '@toris-dev/ui/styles.css';\n`,
  );
  await writeFile(
    join(consumer, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          strict: true,
          noUncheckedIndexedAccess: true,
          esModuleInterop: true,
          skipLibCheck: false,
          noEmit: true,
        },
        include: ['examples/*.tsx', 'exports.ts', 'main.tsx'],
      },
      null,
      2,
    ) + '\n',
  );
  await run(
    process.execPath,
    [
      join(consumer, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '-p',
      join(consumer, 'tsconfig.json'),
    ],
    consumer,
  );
  await writeFile(
    join(consumer, 'runtime.mjs'),
    `import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as esm from '@toris-dev/ui';
const cjs = createRequire(import.meta.url)('@toris-dev/ui');
const names = ${JSON.stringify(newExports)};
for (const name of names) {
  for (const [format, exports] of [['ESM', esm], ['CJS', cjs]]) {
    assert.ok(exports[name], format + ': missing ' + name);
    assert.ok(typeof exports[name] === 'function' || (typeof exports[name] === 'object' && typeof exports[name].render === 'function'), format + ': ' + name + ' must be a React component');
  }
}
console.log('Loaded all ' + names.length + ' new public components from both ESM and CommonJS.');
`,
  );
  console.log(await run(process.execPath, [join(consumer, 'runtime.mjs')], consumer));
  const report = {
    package: {
      name: installedPackage.name,
      version: installedPackage.version,
      archive,
      sha256: createHash('sha256')
        .update(await readFile(archive))
        .digest('hex'),
    },
    examples: examples.map(({ id, name, source }) => ({ id, name, source })),
    documentationExamples: documentation.examples.map(({ id, name, source }) => ({
      id,
      name,
      source,
    })),
    skippedDocumentationSnippets: documentation.skipped,
    exampleCount: examples.length,
    newPublicExports: newExports,
    cssSelectors: newSelectors,
    checks: {
      isolatedTarballInstall: true,
      typecheckAllExamples: true,
      esmAndCommonJsExports: true,
      packedCss: true,
    },
    consumerCompilerVersion: typescript,
  };
  await writeFile(join(consumer, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(
    `PASS: ${installedPackage.name}@${installedPackage.version}; ${examples.length} gallery + ${documentation.examples.length} README examples typechecked with packed declarations; ${newExports.length} runtime exports and CSS families verified.`,
  );
  succeeded = true;
  if (options.keep) console.log(`Consumer and report retained: ${consumer}`);
} catch (error) {
  console.error(`Consumer retained for diagnosis: ${consumer}`);
  throw error;
} finally {
  if (succeeded && !options.keep) await rm(consumer, { recursive: true, force: true });
}
