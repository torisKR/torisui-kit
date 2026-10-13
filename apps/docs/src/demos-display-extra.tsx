import * as React from 'react';
import {
  SearchInput,
  CopyButton,
  Chip,
  Timeline,
  TimelineItem,
  AlertDialog,
  Button,
  Badge,
} from '@toris-dev/ui';
import type { Demo } from './demo-types';
import './demo-display-extra.css';

function SearchInputDemo() {
  const [query, setQuery] = React.useState('');
  const results = ['Button', 'Dialog', 'SearchInput', 'Timeline'].filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <div className="demo-stack demo-search-extra">
      <SearchInput
        label="컴포넌트 찾기"
        placeholder="이름을 입력하세요"
        value={query}
        onValueChange={setQuery}
        clearLabel="검색어 지우기"
      />
      <div className="demo-search-extra__results" aria-live="polite">
        <p className="demo-note">검색 결과 {results.length}개</p>
        {results.length ? (
          results.map((name) => (
            <span key={name} className="demo-search-extra__result">
              {name}
              <span aria-hidden="true">↗</span>
            </span>
          ))
        ) : (
          <p className="demo-note">다른 검색어를 입력해보세요.</p>
        )}
      </div>
    </div>
  );
}

function CopyButtonDemo() {
  return (
    <div className="demo-stack demo-center demo-copy-extra">
      <div className="demo-copy-extra__command">
        <span aria-hidden="true">$</span>
        <code>npm install @toris-dev/ui@^0.6.0</code>
      </div>
      <CopyButton
        text="npm install @toris-dev/ui@^0.6.0"
        copyingLabel="복사 중…"
        copiedLabel="복사 완료"
        errorLabel="다시 복사"
        successMessage="설치 명령어를 클립보드에 복사했어요."
        errorMessage="클립보드를 사용할 수 없어요. 위 명령어를 선택해 직접 복사하세요."
      >
        명령어 복사
      </CopyButton>
      <p className="demo-note">브라우저의 실제 클립보드에 복사해요.</p>
    </div>
  );
}

function ChipDemo() {
  const initial = ['React', '접근성', '인터랙션'];
  const [filters, setFilters] = React.useState(initial);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-chip-extra__list">
        {filters.map((filter) => (
          <Chip
            key={filter}
            tone="primary"
            removeLabel={`${filter} 필터 제거`}
            onRemove={() => setFilters(filters.filter((item) => item !== filter))}
          >
            {filter}
          </Chip>
        ))}
        <Chip disabled onRemove={() => undefined} removeLabel="필수 필터 제거">
          필수
        </Chip>
      </div>
      <p className="demo-note" role="status">
        {filters.length
          ? `${filters.length}개의 필터를 선택했어요.`
          : '선택한 필터를 모두 지웠어요.'}
      </p>
      <Button variant="ghost" size="sm" onClick={() => setFilters(initial)}>
        필터 다시 선택
      </Button>
    </div>
  );
}

function TimelineDemo() {
  const [step, setStep] = React.useState(1);
  const steps = [
    { title: '아이디어 정리', body: '만들고 싶은 경험을 적어요.' },
    { title: '인터페이스 구성', body: '필요한 컴포넌트를 골라요.' },
    { title: '프로토타입 완성', body: '흐름을 직접 눌러 확인해요.' },
  ];
  return (
    <div className="demo-stack demo-timeline-extra">
      <Timeline aria-label="예제 프로젝트 진행 과정">
        {steps.map((item, index) => (
          <TimelineItem
            key={item.title}
            title={item.title}
            status={index < step ? 'completed' : index === step ? 'current' : 'upcoming'}
            statusLabel={index < step ? '완료' : index === step ? '현재 단계' : '예정'}
          >
            {item.body}
          </TimelineItem>
        ))}
      </Timeline>
      <div className="demo-between">
        <Badge tone={step === steps.length ? 'success' : 'primary'}>
          {step === steps.length ? '모두 완료' : `${step + 1}번째 단계`}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStep(step === steps.length ? 0 : step + 1)}
        >
          {step === steps.length ? '다시 시작' : '다음 단계'}
        </Button>
      </div>
    </div>
  );
}

function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [message, setMessage] = React.useState('취소와 삭제를 각각 체험해보세요.');
  return (
    <div className="demo-stack demo-center demo-alert-dialog-extra">
      <div className="demo-alert-dialog-extra__draft">
        <span aria-hidden="true">{deleted ? '✓' : '✎'}</span>
        <strong>{deleted ? '초안을 삭제했어요.' : '새로운 아이디어'}</strong>
        <small>{deleted ? '다시 시작할 수 있어요.' : '아직 작성 중인 초안'}</small>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          if (deleted) {
            setDeleted(false);
            setMessage('초안을 다시 만들었어요.');
          } else setOpen(true);
        }}
      >
        {deleted ? '초안 다시 만들기' : '초안 삭제'}
      </Button>
      <p className="demo-note" role="status">
        {message}
      </p>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        title="초안을 삭제할까요?"
        description="이 예제에서 작성 중인 초안을 삭제해요."
        confirmLabel="초안 삭제"
        cancelLabel="계속 편집"
        onCancel={() => setMessage('삭제를 취소했어요. 초안은 그대로예요.')}
        onConfirm={() => {
          setDeleted(true);
          setMessage('초안을 삭제했어요.');
        }}
      />
    </div>
  );
}

function example(imports: string, body: string) {
  return `import * as React from 'react';\nimport { ${imports} } from '@toris-dev/ui';\n\nexport default function Example() {\n${body.trim()}\n}`;
}

export const displayExtraDemos: Demo[] = [
  {
    id: 'search-input',
    title: '찾는 순간, 바로 보이는 결과',
    name: 'SearchInput',
    category: 'form',
    release: '0.6.0',
    component: SearchInputDemo,
    description:
      '이름을 입력하면 결과가 바뀌어요. 지우기 버튼과 Escape로 검색어를 비워도 입력 포커스가 유지돼요.',
    code: example(
      'SearchInput',
      `  const [query, setQuery] = React.useState('');
  const results = ['Button', 'Dialog', 'SearchInput', 'Timeline'].filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()));
  return <div>
    <SearchInput label="컴포넌트 찾기" placeholder="이름을 입력하세요" value={query} onValueChange={setQuery} clearLabel="검색어 지우기" />
    <div aria-live="polite"><p>검색 결과 {results.length}개</p>{results.map((name) => <p key={name}>{name}</p>)}</div>
  </div>;`,
    ),
  },
  {
    id: 'copy-button',
    title: '복사한 순간을 분명하게',
    name: 'CopyButton',
    category: 'action',
    release: '0.6.0',
    component: CopyButtonDemo,
    description:
      '설치 명령어를 실제 클립보드에 복사해보세요. 복사가 끝난 뒤 완료를 알리고, 사용할 수 없으면 실패 상태를 알려줘요.',
    code: example(
      'CopyButton',
      `  return <div>
    <code>npm install @toris-dev/ui@^0.6.0</code>
    <CopyButton text="npm install @toris-dev/ui@^0.6.0" copyingLabel="복사 중…" copiedLabel="복사 완료" errorLabel="다시 복사" successMessage="설치 명령어를 클립보드에 복사했어요." errorMessage="클립보드를 사용할 수 없어요. 명령어를 선택해 직접 복사하세요.">명령어 복사</CopyButton>
  </div>;`,
    ),
  },
  {
    id: 'chip',
    title: '선택한 취향을 가볍게 정리',
    name: 'Chip',
    category: 'display',
    release: '0.6.0',
    component: ChipDemo,
    description:
      '선택한 필터를 하나씩 제거하고 다시 선택해보세요. 필수 필터는 비활성화되어 제거할 수 없어요.',
    code: example(
      'Chip, Button',
      `  const initial = ['React', '접근성', '인터랙션'];
  const [filters, setFilters] = React.useState(initial);
  return <div>
    {filters.map((filter) => <Chip key={filter} tone="primary" removeLabel={filter + ' 필터 제거'} onRemove={() => setFilters(filters.filter((item) => item !== filter))}>{filter}</Chip>)}
    <Chip disabled onRemove={() => undefined} removeLabel="필수 필터 제거">필수</Chip>
    <p role="status">선택한 필터 {filters.length}개</p>
    <Button variant="ghost" size="sm" onClick={() => setFilters(initial)}>필터 다시 선택</Button>
  </div>;`,
    ),
  },
  {
    id: 'timeline',
    title: '과정과 현재 위치를 한눈에',
    name: 'Timeline',
    category: 'display',
    release: '0.6.0',
    component: TimelineDemo,
    description:
      '다음 단계로 진행하며 완료·현재·예정 상태를 확인하세요. 순서 있는 목록과 현재 단계의 의미를 함께 제공해요.',
    code: example(
      'Timeline, TimelineItem, Button',
      `  const [step, setStep] = React.useState(1);
  const steps = ['아이디어 정리', '인터페이스 구성', '프로토타입 완성'];
  return <div>
    <Timeline aria-label="예제 프로젝트 진행 과정">{steps.map((title, index) => <TimelineItem key={title} title={title} status={index < step ? 'completed' : index === step ? 'current' : 'upcoming'} statusLabel={index < step ? '완료' : index === step ? '현재 단계' : '예정'} />)}</Timeline>
    <Button variant="outline" onClick={() => setStep(step === steps.length ? 0 : step + 1)}>{step === steps.length ? '다시 시작' : '다음 단계'}</Button>
  </div>;`,
    ),
  },
  {
    id: 'alert-dialog',
    title: '중요한 결정에 한 번 더 확인',
    name: 'AlertDialog',
    category: 'overlay',
    release: '0.6.0',
    component: AlertDialogDemo,
    description:
      '초안을 삭제하거나 계속 편집하세요. 취소 버튼에 먼저 포커스되며 Escape도 삭제 없이 취소해요.',
    code: example(
      'AlertDialog, Button',
      `  const [open, setOpen] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [message, setMessage] = React.useState('취소와 삭제를 각각 체험해보세요.');
  return <div>
    <p>{deleted ? '초안을 삭제했어요.' : '새로운 아이디어 — 작성 중인 초안'}</p>
    <Button variant="outline" onClick={() => { if (deleted) { setDeleted(false); setMessage('초안을 다시 만들었어요.'); } else setOpen(true); }}>{deleted ? '초안 다시 만들기' : '초안 삭제'}</Button>
    <p role="status">{message}</p>
    <AlertDialog open={open} onOpenChange={setOpen} title="초안을 삭제할까요?" description="이 예제에서 작성 중인 초안을 삭제해요." confirmLabel="초안 삭제" cancelLabel="계속 편집" onCancel={() => setMessage('삭제를 취소했어요.')} onConfirm={() => { setDeleted(true); setMessage('초안을 삭제했어요.'); }} />
  </div>;`,
    ),
  },
];
