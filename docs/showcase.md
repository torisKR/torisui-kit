# 인터랙티브 컴포넌트 갤러리

`apps/docs`는 `@toris-dev/ui`의 실제 컴포넌트를 조작하는 공개 갤러리입니다. 분류·한국어/영어 검색, 라이트/다크 테마, 브랜드 색상·모서리 설정, 큰 미리보기와 320px 너비 체험, 예제 코드 복사, 예제 초기화를 제공합니다. 표시 개수는 데모 카탈로그에서 계산합니다.

기존 37종에 NumberInput, SegmentedControl, Stepper, TagInput, Meter, SearchInput, CopyButton, Chip, Timeline, AlertDialog를 추가했습니다. 추가 10종은 npm 0.6.0부터 공개 API와 스타일에 포함됩니다. 카드와 상세 설명에 처음 포함된 버전을 표시합니다. 갤러리 설치 명령어는 패키지 manifest의 버전에서 생성하며, `npm install @toris-dev/ui@^0.6.0`으로 설치한 뒤 공통 CSS와 `ToriProvider`를 적용하면 모든 사용 예시를 사용할 수 있습니다.

## 구조화 데이터와 검증

`scripts/gallery-schema.mjs`는 실제 React 예제 목록의 메타데이터를 읽어 HTML 빌드 시 JSON-LD를 삽입합니다. 브라우저 JavaScript 실행 없이 HTML 소스에서 확인할 수 있습니다. CollectionPage, ItemList, SoftwareSourceCode, BreadcrumbList와 사이트·스튜디오 관계를 설명하며, 예제 이름·설명·순서·링크·개수는 같은 목록에서 가져옵니다. 공개되지 않은 패키지 버전이나 실제 사용자 평가를 메타데이터로 주장하지 않습니다.

```sh
pnpm --filter torisui-docs build
pnpm verify:gallery
```

검증은 JSON-LD와 실제 카탈로그 일치, HTML 직렬화 안전성, canonical, 컴포넌트 public export를 확인합니다. 배포 후 [Schema.org Validator](https://validator.schema.org/)와 [Google Rich Results Test](https://search.google.com/test/rich-results)에서 운영 주소를 확인할 수 있습니다. 스키마 모델은 [CollectionPage](https://schema.org/CollectionPage), [SoftwareSourceCode](https://schema.org/SoftwareSourceCode), [Google 구조화 데이터 지침](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)을 따릅니다.

`pnpm verify:package-examples /absolute/path/to/package.tgz`는 별도 소비자 프로젝트에 실제 tarball을 설치하여 47개 예시와 README의 TSX를 타입 검사하고, ESM/CJS 공개 API 및 CSS 포함 여부를 확인합니다. npm 출시 후에는 레지스트리에서 받은 tarball로 같은 검증을 다시 수행합니다.

## 로컬 확인

```sh
pnpm install --frozen-lockfile
pnpm --filter torisui-docs dev
```

Vite 기본 주소 뒤에 `/torisui-kit/`를 붙여 엽니다. 분류와 컴포넌트 선택은 URL에 반영되어 공유와 뒤로 가기를 지원합니다.

## 토리스 사이트에 반영

```sh
pnpm --filter torisui-docs build
pnpm export:site /absolute/path/to/toris-site
```

이 명령은 대상의 `.openai/hosting.json` 프로젝트 ID를 확인하고 `public/torisui-kit/`에 빌드 파일만 복사합니다. 정적 파일은 `/torisui-kit/` 아래에서 제공됩니다. 갤러리 소스를 수정한 뒤에는 다시 빌드하고 내보내야 합니다.

사이트의 `src/data/projects.ts`에 있는 TorisUI Kit 목적지와 `StudioHome.astro`의 TorisUI Kit 링크는 `/torisui-kit/`를 가리킵니다. 제품 카탈로그의 기존 출시 구분은 유지합니다.

토리스 사이트의 `build:sites` 절차로 빌드하고, 정확한 소스를 커밋·푸시한 뒤 기존 Sites 프로젝트에 저장 및 배포합니다. 다른 채팅의 작업이 진행 중이라면 공개된 소스에서 필요한 파일만 반영하는 별도 체크아웃을 사용합니다. 로컬 빌드 성공과 운영 사이트 공개 확인은 각각 검증합니다.
