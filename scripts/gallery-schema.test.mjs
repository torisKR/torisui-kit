import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGallerySchema,
  parseDemoMetadata,
  serializeSchema,
  galleryUrl,
} from './gallery-schema.mjs';

const metadata = {
  id: 'tag-input',
  name: 'TagInput',
  title: '태그로 정리하기',
  category: 'form',
  description: '태그를 추가하고 삭제하세요.',
  release: '0.6.0',
};

test('catalog extraction ignores rendered JSX and copied code, preserving real metadata', () => {
  const source = `export const demos = [{ id: 'tag-input', name: 'TagInput', title: '태그로 정리하기', category: 'form', description: '태그를 추가하고 삭제하세요.', release: '0.6.0', component: TagInputDemo, code: example('wrong', 'wrong') }];`;
  assert.deepEqual(parseDemoMetadata(source, 'demos'), [metadata]);
  assert.throws(
    () =>
      parseDemoMetadata(
        source.replace("description: '태그를 추가하고 삭제하세요.'", 'description: dynamicText'),
        'demos',
      ),
    /string literal/,
  );
});

test('graph describes the real collection, source, order and reachable component links', () => {
  const graph = buildGallerySchema([metadata])['@graph'];
  const page = graph.find((node) => node['@type'] === 'CollectionPage');
  const list = graph.find((node) => node['@type'] === 'ItemList');
  assert.equal(page.url, galleryUrl);
  assert.equal(list.numberOfItems, 1);
  assert.equal(list.itemListElement[0].position, 1);
  assert.equal(list.itemListElement[0].item.description, metadata.description);
  assert.equal(
    new URL(list.itemListElement[0].item.url).searchParams.get('component'),
    metadata.id,
  );
  const serialized = JSON.stringify(graph);
  for (const fabricated of ['aggregateRating', 'offers', 'review', 'softwareVersion'])
    assert.ok(!serialized.includes(`"${fabricated}"`));
});

test('serialization prevents HTML script breakouts while preserving JSON content', () => {
  const payload = { name: '</script><script>alert(1)</script>', description: 'line\u2028break' };
  const text = serializeSchema(payload);
  assert.ok(!text.includes('<'));
  assert.deepEqual(JSON.parse(text), payload);
});
