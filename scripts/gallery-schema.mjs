import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import ts from 'typescript';

export const galleryUrl = 'https://toris.kr/torisui-kit/';
export const repositoryUrl = 'https://github.com/torisKR/torisui-kit';
export const galleryDescription =
  'TorisUI Kit의 React 컴포넌트를 직접 눌러 보고, 색상·모서리·미리보기 너비와 사용 코드를 확인하세요.';

// Read metadata from the actual render catalog without evaluating React or browser code.
export function parseDemoMetadata(source, arrayName, filename = 'catalog.tsx') {
  const file = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const declaration = file.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find((item) => ts.isIdentifier(item.name) && item.name.text === arrayName);
  if (!declaration?.initializer || !ts.isArrayLiteralExpression(declaration.initializer)) {
    throw new Error(`Expected a literal ${arrayName} catalog in ${filename}`);
  }
  return declaration.initializer.elements.filter(ts.isObjectLiteralExpression).map((element) => {
    const metadata = {};
    for (const property of element.properties) {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) continue;
      const key = property.name.text;
      if (!['id', 'name', 'title', 'description', 'category', 'release'].includes(key)) continue;
      if (!ts.isStringLiteral(property.initializer)) {
        throw new Error(`${filename}: ${key} must be a string literal to keep schema in sync`);
      }
      metadata[key] = property.initializer.text;
    }
    for (const key of ['id', 'name', 'title', 'description', 'category']) {
      if (!metadata[key]) throw new Error(`${filename}: missing ${key}`);
    }
    if (!/^[a-z][a-z0-9-]*$/.test(metadata.id)) throw new Error(`Invalid demo ID: ${metadata.id}`);
    return metadata;
  });
}

export async function readGalleryCatalog(root) {
  const sources = [
    ['apps/docs/src/demos.tsx', 'demos'],
    ['apps/docs/src/demos-input-extra.tsx', 'inputExtraDemos'],
    ['apps/docs/src/demos-display-extra.tsx', 'displayExtraDemos'],
  ];
  const groups = await Promise.all(
    sources.map(async ([path, name]) =>
      parseDemoMetadata(await readFile(resolve(root, path), 'utf8'), name, path),
    ),
  );
  const catalog = groups.flat();
  if (new Set(catalog.map((item) => item.id)).size !== catalog.length) {
    throw new Error('Duplicate component IDs in gallery catalog');
  }
  return catalog;
}

export function buildGallerySchema(catalog) {
  const organization = 'https://toris.kr/#organization';
  const website = 'https://toris.kr/#website';
  const page = `${galleryUrl}#webpage`;
  const list = `${galleryUrl}#components`;
  const source = `${galleryUrl}#source`;
  const breadcrumb = `${galleryUrl}#breadcrumb`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organization,
        name: 'Toris Studio',
        url: 'https://toris.kr/',
      },
      {
        '@type': 'WebSite',
        '@id': website,
        name: '토리스 스튜디오',
        url: 'https://toris.kr/',
        publisher: { '@id': organization },
      },
      {
        '@type': 'CollectionPage',
        '@id': page,
        url: galleryUrl,
        name: 'TorisUI Kit · 직접 만져 보는 컴포넌트',
        description: galleryDescription,
        inLanguage: 'ko-KR',
        isPartOf: { '@id': website },
        publisher: { '@id': organization },
        about: { '@id': source },
        mainEntity: { '@id': list },
        breadcrumb: { '@id': breadcrumb },
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': source,
        name: 'TorisUI Kit',
        codeRepository: repositoryUrl,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'React',
        license: `${repositoryUrl}/blob/main/LICENSE`,
        author: { '@id': organization },
        subjectOf: { '@id': page },
      },
      {
        '@type': 'ItemList',
        '@id': list,
        name: 'TorisUI Kit 컴포넌트 예제',
        numberOfItems: catalog.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: catalog.map((demo, index) => {
          const url = `${galleryUrl}?component=${encodeURIComponent(demo.id)}`;
          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'SoftwareSourceCode',
              '@id': `${url}#example`,
              url,
              name: `${demo.name} · ${demo.title}`,
              description: demo.description,
              programmingLanguage: 'TypeScript',
              codeSampleType: 'code snippet',
              isPartOf: { '@id': source },
            },
          };
        }),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumb,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Toris Studio', item: 'https://toris.kr/' },
          { '@type': 'ListItem', position: 2, name: 'TorisUI Kit', item: galleryUrl },
        ],
      },
    ],
  };
}

export function serializeSchema(schema) {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function gallerySchemaPlugin(root) {
  return {
    name: 'torisui-gallery-schema',
    async transformIndexHtml() {
      const catalog = await readGalleryCatalog(root);
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json', id: 'torisui-schema' },
          children: serializeSchema(buildGallerySchema(catalog)),
          injectTo: 'head',
        },
      ];
    },
  };
}
