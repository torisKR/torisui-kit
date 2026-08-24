# TorisUI Kit

React 제품에 일관된 인터랙션과 접근성을 제공하는 **`@toris-dev/ui`** 컴포넌트 라이브러리 모노레포입니다. 다크 테마를 기본으로 하며 버튼·폼·오버레이·탐색·피드백 컴포넌트를 조합해 제품 UI를 빠르게 구성합니다.

## 제공 범위

- `@toris-dev/ui`: Button, Card, Input, Select, Checkbox, RadioGroup, Slider, Toggle, Dialog, Sheet, Popover, Table, Tabs, Tooltip, DropdownMenu, Toast, Pagination 등
- WAI-ARIA 키보드 탐색, 포커스 트랩, reduced-motion, forced-colors를 고려한 상호작용
- `ToriProvider`, 디자인 토큰, 테마 스타일시트
- `apps/docs`: Vite 기반 컴포넌트 플레이그라운드

## 구조

```text
packages/ui/   라이브러리 소스·Vitest 테스트·tsup 빌드
apps/docs/     문서/컴포넌트 플레이그라운드
docs/          시작하기·아키텍처·테마·릴리스 문서
```

## 사용

```bash
pnpm install
pnpm --filter @toris-dev/ui build
```

```tsx
import { Button, Card, ToriProvider } from '@toris-dev/ui';
import '@toris-dev/ui/styles.css';

export function Example() {
  return <ToriProvider theme="dark"><Card interactive><Button variant="glow">시작</Button></Card></ToriProvider>;
}
```

## 개발 및 검증

```bash
pnpm --filter torisui-docs dev   # 문서 앱
pnpm test                        # 전체 테스트
pnpm verify                      # lint, typecheck, test, build
pnpm changeset                   # 릴리스 변경 기록
```

Node.js 20 이상, pnpm 9.14.2를 사용합니다. npm 배포는 Changesets와 저장소의 Trusted Publishing CI를 통해 수행하며, 로컬 `pnpm build`는 패키지 산출물 확인일 뿐 스토어 출시를 의미하지 않습니다.

## 문서와 라이선스

- [Getting started](./docs/getting-started.md) · [Architecture](./docs/architecture.md) · [Theming](./docs/theming.md) · [Component API](./docs/components.md)
- [MIT](./LICENSE) © toris-dev
