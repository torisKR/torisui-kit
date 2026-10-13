# @toris-dev/ui

React용 TorisUI 컴포넌트 라이브러리입니다. 부드러운 표면·색상 강조·상호작용을 CSS 토큰으로 조정하고, 라이트·다크·시스템 테마를 사용할 수 있습니다.

[47종 컴포넌트 갤러리](https://toris.kr/torisui-kit/)에서 입력·선택·탐색·모달을 직접 사용해보세요. 검색, 브랜드 색상과 모서리 설정, 모바일 너비 미리보기, 코드 복사를 지원합니다.

## 설치

React 18 이상과 React DOM이 필요합니다.

```bash
npm install @toris-dev/ui@^0.6.0
# 또는
pnpm add @toris-dev/ui@^0.6.0
```

## 기본 사용

앱 진입점에서 스타일시트를 한 번 가져오고 루트를 `ToriProvider`로 감싸주세요.

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

`theme`은 `light`, `dark`, `system`을 지원하며 기본값은 `system`입니다. `ToriProvider`는 문서 루트의 `data-theme`과 Toast 시스템을 관리합니다. 그 아래에서 `useTheme()`으로 테마를 바꾸고 `useToast()`로 알림을 표시하세요.

## 0.6.0의 신규 컴포넌트

새로운 10종도 패키지 루트에서 import할 수 있습니다. 스타일은 기존 `@toris-dev/ui/styles.css`에 포함됩니다.

| 컴포넌트                    | 주요 API와 동작                                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `NumberInput`               | `value`/`defaultValue`, `onValueChange`, `min`/`max`/`step`, 증감 버튼과 ArrowUp/ArrowDown                         |
| `SegmentedControl`          | `options: { value, label, disabled? }[]`, `value`/`onValueChange`, `orientation`, 단일 선택과 방향키 탐색          |
| `Stepper`                   | `steps: { label, description?, disabled? }[]`, 0부터 시작하는 `value`, `onValueChange`, `orientation`              |
| `TagInput`                  | `value: string[]`/`onValueChange`, `maxTags`/`maxTagLength`, 중복 검사, Enter·쉼표 추가와 빈 입력의 Backspace 삭제 |
| `Meter`                     | 필수 `value`, `min`/`max`, `low`/`high`/`optimum`, `label`, `tone`, 네이티브 측정값 의미                           |
| `SearchInput`               | `value`/`onValueChange`, `onClear`, `clearLabel`, 검색어 지우기와 Escape 처리                                      |
| `CopyButton`                | 필수 `text`, `onCopy`/`onCopyError`, 복사 중·성공·실패 라벨, `resetAfter`                                          |
| `Chip`                      | `tone`, `onRemove`, `removeLabel`, `disabled`, 선택 항목 표시와 제거                                               |
| `Timeline` / `TimelineItem` | `title`, `status: 'completed' \| 'current' \| 'upcoming'`, `statusLabel`, `dateTime`/`dateLabel`                   |
| `AlertDialog`               | `open`/`onOpenChange`, `onConfirm`/`onCancel`, `confirmLabel`/`cancelLabel`, `confirmDisabled`, `destructive`      |

`NumberInput`, `TagInput`, `SearchInput`, `SegmentedControl`, `Stepper`를 controlled 방식으로 사용하려면 `value`와 `onValueChange`를 연결하세요. `NumberInput`의 범위 밖 입력은 blur나 Enter에서 범위 안으로 맞추며 빈 입력은 이전 값으로 복원합니다. `TagInput`은 태그 개수와 길이, 대소문자를 무시한 중복을 검사합니다.

`CopyButton`은 브라우저 클립보드 쓰기가 완료되어야 성공을 표시합니다. HTTPS 등 클립보드를 사용할 수 있는 환경이 필요하며, 쓰기가 거절되면 `errorMessage`와 `onCopyError`로 실패를 전달합니다. `AlertDialog`는 취소 버튼에 초기 포커스를 주고, 배경 클릭으로 닫히지 않습니다.

## 숫자·태그·확인 모달 조합

아래 예시는 수량과 태그를 편집하고 확인 후 선택을 초기화합니다.

```tsx
import * as React from 'react';
import { AlertDialog, Button, NumberInput, TagInput, ToriProvider } from '@toris-dev/ui';
import '@toris-dev/ui/styles.css';

export default function App() {
  const [quantity, setQuantity] = React.useState(1);
  const [tags, setTags] = React.useState<string[]>(['React']);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

  return (
    <ToriProvider theme="system">
      <NumberInput
        label="수량"
        name="quantity"
        value={quantity}
        onValueChange={setQuantity}
        min={1}
        max={12}
        step={1}
        decreaseLabel="수량 줄이기"
        increaseLabel="수량 늘리기"
      />
      <TagInput
        label="관심 분야"
        name="tags"
        value={tags}
        onValueChange={setTags}
        maxTags={4}
        maxTagLength={20}
        placeholder="태그 입력 후 Enter"
        addLabel="태그 추가"
        removeLabel={(tag) => `${tag} 삭제`}
        messages={{
          duplicate: '이미 추가한 태그예요.',
          limit: '태그는 최대 4개까지 추가할 수 있어요.',
          tooLong: '태그는 20자 이내로 입력해주세요.',
          added: '추가한 태그:',
          removed: '삭제한 태그:',
        }}
      />
      <Button variant="outline" onClick={() => setConfirmOpen(true)}>
        선택 초기화
      </Button>
      <p role="status">{message}</p>
      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="선택을 초기화할까요?"
        description="수량을 1로 바꾸고 입력한 태그를 비워요."
        confirmLabel="초기화"
        cancelLabel="계속 편집"
        destructive={false}
        onConfirm={() => {
          setQuantity(1);
          setTags([]);
          setMessage('선택을 초기화했어요.');
        }}
        onCancel={() => setMessage('선택을 유지했어요.')}
      />
    </ToriProvider>
  );
}
```

## 기존 컴포넌트와 도구

Button · IconButton · Card · Input · Textarea · Select · Checkbox · RadioGroup · Switch · Slider · Rating · Toggle · ToggleGroup · Tabs · Accordion · Collapsible · Pagination · Breadcrumb · Dialog · Sheet · Popover · DropdownMenu · Tooltip · HoverCard · Toast (`useToast`) · Badge · Avatar · Alert · Progress · Spinner · Skeleton · EmptyState · Table · Separator · Label · Kbd · AspectRatio

Card, Tabs, Table 등의 구성 요소도 함께 export합니다. `Slot`, `Portal`, `VisuallyHidden`, `composeRefs`와 `useControllableState`, `useEscapeKey`, `useFocusReturn`, `useDismissableLayer`, `useAnchoredPosition` 등의 훅을 사용할 수 있습니다. 공개 컴포넌트의 props 타입도 export합니다.

## 테마와 브랜드

`--tori-*` CSS 변수를 앱 스타일에서 덮어쓰세요. 색상 변수는 공백으로 구분한 RGB 값이며, 다크 테마도 별도로 설정할 수 있습니다.

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

라벨·키보드 탐색·상태 메시지·모달 포커스 처리를 제공하며, 스타일시트는 reduced-motion과 forced-colors 환경을 고려합니다. 사용 중인 컴포넌트에 적절한 라벨과 오류 메시지를 전달해주세요.

자세한 문서는 [저장소 문서](https://github.com/torisKR/torisui-kit/tree/main/docs), 실제 사용 예시는 [갤러리](https://toris.kr/torisui-kit/)에서 확인할 수 있습니다.

## 라이선스

MIT © toris-dev
