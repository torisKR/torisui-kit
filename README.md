# TorisUI Kit

**`@toris-dev/ui`**는 React 인터페이스를 위한 컴포넌트 라이브러리입니다. 버튼·입력·탐색·오버레이·피드백을 조합하고, CSS 변수로 브랜드 색상과 모서리를 조정할 수 있습니다. 라이트·다크·시스템 테마를 지원합니다.

[컴포넌트 갤러리](https://toris.kr/torisui-kit/)에서 **47종의 데모**를 직접 눌러보세요. 분류·검색·테마·브랜드 색상·모서리 설정, 320px 상세 미리보기, 사용 코드 복사를 제공합니다.

## 설치와 시작

React 18 이상과 React DOM이 필요합니다.

```bash
npm install @toris-dev/ui@^0.6.0
# 또는
pnpm add @toris-dev/ui@^0.6.0
```

스타일시트를 한 번 가져오고 앱 루트를 `ToriProvider`로 감싸주세요.

```tsx
import * as React from 'react';
import { Button, ToriProvider } from '@toris-dev/ui';
import '@toris-dev/ui/styles.css';

export default function App() {
  const [message, setMessage] = React.useState('버튼을 눌러보세요.');

  return (
    <ToriProvider theme="system">
      <Button variant="solid" onClick={() => setMessage('좋은 시작이에요!')}>
        시작하기
      </Button>
      <p role="status">{message}</p>
    </ToriProvider>
  );
}
```

`theme`은 `light`, `dark`, `system` 중 선택하며 기본값은 `system`입니다. `ToriProvider` 아래에서 `useTheme()`으로 테마를 바꾸고, `useToast()`로 알림을 표시할 수 있습니다.

## 0.6.0에 추가된 컴포넌트

다음 10종은 `@toris-dev/ui`의 공개 API와 패키지 스타일시트에 포함됩니다.

| 컴포넌트                    | 기능과 주요 API                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `NumberInput`               | 숫자 입력·증감 버튼·방향키, `min`/`max`/`step`, `value`와 `onValueChange`            |
| `SegmentedControl`          | 단일 선택, `options`, `value`/`onValueChange`, 방향키·Home·End 탐색                  |
| `Stepper`                   | 단계 선택, `steps`, 0부터 시작하는 `value`, 비활성 단계와 가로·세로 방향             |
| `TagInput`                  | Enter·쉼표로 추가, 빈 입력에서 Backspace로 마지막 태그 삭제, 중복·개수·길이 검사     |
| `Meter`                     | 정해진 범위의 측정값, `value`/`min`/`max`, 네이티브 `meter`와 `low`/`high`/`optimum` |
| `SearchInput`               | 검색어 입력·지우기·Escape, `value`/`onValueChange`, `onClear`                        |
| `CopyButton`                | 클립보드 쓰기 완료 후 성공 표시, 실패 안내, `onCopy`/`onCopyError`                   |
| `Chip`                      | 제거할 수 있는 항목 표시, `tone`, `onRemove`, `removeLabel`                          |
| `Timeline` / `TimelineItem` | 완료·현재·예정 상태, `status`, `statusLabel`, `dateTime`/`dateLabel`                 |
| `AlertDialog`               | 확인·취소 모달, 취소 버튼 초기 포커스, `open`/`onOpenChange`, `onConfirm`/`onCancel` |

기존 Button, IconButton, Card, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Rating, Toggle, ToggleGroup, Tabs, Accordion, Collapsible, Pagination, Breadcrumb, Dialog, Sheet, Popover, DropdownMenu, Tooltip, HoverCard, Toast, Badge, Avatar, Alert, Progress, Spinner, Skeleton, EmptyState, Table, Separator, Label, Kbd, AspectRatio도 함께 제공합니다.

숫자·태그·확인 모달을 조합한 완전한 예시는 [패키지 README](./packages/ui/README.md#숫자태그확인-모달-조합)를 참고하세요. 신규 컴포넌트도 일반 import로 사용하며 별도 확장 경로나 스타일시트를 추가할 필요가 없습니다.

## 브랜드와 테마

CSS 변수의 색상은 공백으로 구분한 RGB 값입니다. 다크 테마도 함께 덮어쓰면 두 테마에서 같은 브랜드를 유지할 수 있습니다.

```css
:root {
  --tori-primary: 36 105 70;
  --tori-primary-strong: 23 77 50;
  --tori-primary-fg: 255 255 255;
  --tori-radius-md: 12px;
}

[data-theme='dark'] {
  --tori-primary: 128 208 167;
  --tori-primary-strong: 105 187 145;
  --tori-primary-fg: 13 38 23;
}
```

키보드 탐색, 라벨과 상태 메시지, 모달 포커스 처리, reduced-motion 및 forced-colors 스타일을 제공합니다. 컴포넌트별 사용법은 [API 문서](./docs/components.md), 토큰과 테마 사용법은 [테마 문서](./docs/theming.md)를 참고하세요.

## 저장소 개발

```text
packages/ui/   라이브러리 소스·Vitest 테스트·tsup 빌드
apps/docs/     47종 인터랙티브 컴포넌트 갤러리
docs/          시작하기·아키텍처·테마·검증·릴리스 문서
scripts/       갤러리 스키마 생성·사이트 내보내기
```

Node.js 20 이상, pnpm 9.14.2를 사용합니다.

```bash
pnpm install
pnpm --filter torisui-docs dev   # /torisui-kit/에서 갤러리 실행
pnpm --filter @toris-dev/ui build
pnpm test                       # Vitest 테스트
pnpm verify                     # lint, typecheck, test, build
pnpm changeset                  # 릴리스 변경 기록
```

갤러리는 라이브러리 소스를 직접 읽어 변경사항을 반영합니다. 토리스 사이트에 빌드 결과를 연결하는 절차와 스키마 주소는 [쇼케이스 문서](./docs/showcase.md)를 참고하세요. 패키지 배포 절차는 [릴리스 문서](./docs/release.md)에 있습니다.

## 문서와 라이선스

- [문서 목차](./docs/README.md) · [시작하기](./docs/getting-started.md) · [아키텍처](./docs/architecture.md)
- [MIT](./LICENSE) © toris-dev
