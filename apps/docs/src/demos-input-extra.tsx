import * as React from 'react';
import { Badge, Button, Slider } from '@toris-dev/ui';
import { NumberInput } from '../../../packages/ui/src/components/number-input';
import { SegmentedControl } from '../../../packages/ui/src/components/segmented-control';
import { Stepper } from '../../../packages/ui/src/components/stepper';
import { TagInput } from '../../../packages/ui/src/components/tag-input';
import { Meter } from '../../../packages/ui/src/components/meter';
import type { Demo } from './demo-types';

function NumberInputDemo() {
  const [people, setPeople] = React.useState(3);
  return (
    <div className="demo-stack demo-input-extra">
      <div className="demo-seat-preview" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} data-active={index < people}>
            <i />
          </span>
        ))}
      </div>
      <NumberInput
        label="함께할 인원"
        value={people}
        onValueChange={setPeople}
        min={1}
        max={8}
        decreaseLabel="인원 줄이기"
        increaseLabel="인원 늘리기"
        helperText="1명에서 8명까지 선택할 수 있어요."
      />
      <p className="demo-note" role="status">
        {people}명이 함께 만들 준비가 됐어요.
      </p>
    </div>
  );
}

function SegmentedControlDemo() {
  const [view, setView] = React.useState('board');
  const options = [
    { value: 'board', label: '보드' },
    { value: 'list', label: '리스트' },
    { value: 'calendar', label: '달력' },
  ];
  return (
    <div className="demo-stack demo-input-extra demo-center">
      <SegmentedControl
        value={view}
        onValueChange={setView}
        options={options}
        aria-label="프로젝트 보기 방식"
      />
      <div
        className={`demo-view-layout demo-view-layout--${view}`}
        aria-label={`${options.find((option) => option.value === view)?.label} 미리보기`}
      >
        {view === 'calendar'
          ? Array.from({ length: 14 }, (_, index) => (
              <span key={index} data-marked={[2, 6, 9].includes(index)}>
                {index + 1}
              </span>
            ))
          : ['아이디어', '디자인', '완성'].map((item, index) => (
              <div key={item}>
                <i className={`demo-view-dot demo-view-dot--${index}`} />
                <span>{item}</span>
                <i className="demo-view-line" />
              </div>
            ))}
      </div>
      <p className="demo-note" role="status">
        하나의 프로젝트, 세 가지 보기 방식.
      </p>
    </div>
  );
}

function StepperDemo() {
  const [step, setStep] = React.useState(0);
  const steps = [{ label: '아이디어' }, { label: '디자인' }, { label: '완료' }];
  const content = ['무엇을 만들고 싶나요?', '아이디어에 형태를 더하세요.', '준비를 모두 마쳤어요.'];
  return (
    <div className="demo-stack demo-input-extra">
      <Stepper steps={steps} value={step} onValueChange={setStep} aria-label="프로젝트 시작 단계" />
      <div className="demo-step-caption" role="status">
        {step === 2 && <Badge tone="success">완료</Badge>}
        <span>{content[step]}</span>
      </div>
      <div className="demo-between">
        <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>
          이전
        </Button>
        {step === 2 ? (
          <Button variant="outline" size="sm" onClick={() => setStep(0)}>
            다시 시작
          </Button>
        ) : (
          <Button size="sm" onClick={() => setStep(step + 1)}>
            다음 단계
          </Button>
        )}
      </div>
    </div>
  );
}

function TagInputDemo() {
  const [tags, setTags] = React.useState(['React', 'UI']);
  return (
    <div className="demo-stack demo-input-extra">
      <TagInput
        label="프로젝트 키워드"
        value={tags}
        onValueChange={setTags}
        maxTags={4}
        maxTagLength={12}
        placeholder="키워드 입력"
        addLabel="키워드 추가"
        removeLabel={(tag) => `${tag} 삭제`}
        helperText="Enter 또는 쉼표로 추가하세요. 최대 4개."
        messages={{
          duplicate: '이미 추가한 키워드예요.',
          limit: '최대 4개까지 추가할 수 있어요.',
          tooLong: '12자 이내로 입력해주세요.',
          added: '추가했어요:',
          removed: '삭제했어요:',
        }}
      />
      <p className="demo-note" role="status">
        {tags.length} / 4개 · 빈 입력에서 Backspace로 마지막 키워드 삭제
      </p>
    </div>
  );
}

function MeterDemo() {
  const [used, setUsed] = React.useState(6);
  return (
    <div className="demo-stack demo-input-extra">
      <div className="demo-meter-heading">
        <span>공간 활용도</span>
        <strong>
          {used}
          <small> GB</small>
        </strong>
      </div>
      <Meter
        label="사용한 저장 공간"
        value={used}
        max={10}
        tone={used >= 8 ? 'warning' : 'primary'}
        aria-valuetext={`${used} GB 사용, 전체 10 GB`}
      />
      <Slider label="사용량 조절" value={used} onValueChange={setUsed} min={0} max={10} step={1} />
      <p className="demo-note">
        슬라이더로 측정값을 바꿔보세요. 작업 진행률이 아닌 현재 사용량이에요.
      </p>
    </div>
  );
}

export const inputExtraDemos: Demo[] = [
  {
    id: 'number-input',
    name: 'NumberInput',
    title: '숫자는 정확하게, 조절은 간편하게',
    category: 'form',
    release: '0.6.0',
    description: '입력과 더하기·빼기를 연결했어요. 최솟값과 최댓값, 소수 단위와 방향키를 지원해요.',
    component: NumberInputDemo,
    code: `import * as React from 'react';
import { NumberInput } from '@toris-dev/ui';

export default function Example() {
  const [people, setPeople] = React.useState(3);
  return <div>
    <NumberInput label="함께할 인원" value={people} onValueChange={setPeople} min={1} max={8}
      decreaseLabel="인원 줄이기" increaseLabel="인원 늘리기" helperText="1명에서 8명까지 선택할 수 있어요." />
    <p role="status">{people}명이 함께 만들 준비가 됐어요.</p>
  </div>;
}`,
  },
  {
    id: 'segmented-control',
    name: 'SegmentedControl',
    title: '하나의 선택으로 달라지는 보기',
    category: 'form',
    release: '0.6.0',
    description:
      '보드·리스트·달력을 하나의 선택 그룹으로 묶었어요. 방향키와 Home·End로도 전환하세요.',
    component: SegmentedControlDemo,
    code: `import * as React from 'react';
import { SegmentedControl } from '@toris-dev/ui';

export default function Example() {
  const [view, setView] = React.useState('board');
  const options = [{ value: 'board', label: '보드' }, { value: 'list', label: '리스트' }, { value: 'calendar', label: '달력' }];
  return <div>
    <SegmentedControl value={view} onValueChange={setView} options={options} aria-label="프로젝트 보기 방식" />
    {view === 'calendar' ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {Array.from({ length: 14 }, (_, index) => <span key={index}>{index + 1}</span>)}
    </div> : <div style={{ display: 'flex', flexDirection: view === 'board' ? 'row' : 'column', gap: 12 }}>
      {['아이디어', '디자인', '완성'].map((item) => <div key={item}>{item}</div>)}
    </div>}
  </div>;
}`,
  },
  {
    id: 'stepper',
    name: 'Stepper',
    title: '시작부터 완성까지, 한 단계씩',
    category: 'navigation',
    release: '0.6.0',
    description:
      '워크플로의 현재 단계와 완료된 단계를 보여줘요. 단계 클릭, 이전·다음 이동을 체험하세요.',
    component: StepperDemo,
    code: `import * as React from 'react';
import { Stepper, Button, Badge } from '@toris-dev/ui';

export default function Example() {
  const [step, setStep] = React.useState(0);
  const steps = [{ label: '아이디어' }, { label: '디자인' }, { label: '완료' }];
  const content = ['무엇을 만들고 싶나요?', '아이디어에 형태를 더하세요.', '준비를 모두 마쳤어요.'];
  return <div>
    <Stepper steps={steps} value={step} onValueChange={setStep} aria-label="프로젝트 시작 단계" />
    <p role="status">{step === 2 && <Badge tone="success">완료</Badge>} {content[step]}</p>
    <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>이전</Button>
    {step === 2 ? <Button variant="outline" size="sm" onClick={() => setStep(0)}>다시 시작</Button> : <Button size="sm" onClick={() => setStep(step + 1)}>다음 단계</Button>}
  </div>;
}`,
  },
  {
    id: 'tag-input',
    name: 'TagInput',
    title: '생각을 키워드로 모아두기',
    category: 'form',
    release: '0.6.0',
    description:
      'Enter·쉼표로 추가하고 삭제 버튼·Backspace로 제거하세요. 중복과 개수·길이 제한을 확인해보세요.',
    component: TagInputDemo,
    code: `import * as React from 'react';
import { TagInput } from '@toris-dev/ui';

export default function Example() {
  const [tags, setTags] = React.useState(['React', 'UI']);
  return <div>
    <TagInput label="프로젝트 키워드" value={tags} onValueChange={setTags} maxTags={4} maxTagLength={12}
      placeholder="키워드 입력" addLabel="키워드 추가" removeLabel={(tag) => tag + ' 삭제'}
      helperText="Enter 또는 쉼표로 추가하세요. 최대 4개."
      messages={{ duplicate: '이미 추가한 키워드예요.', limit: '최대 4개까지 추가할 수 있어요.', tooLong: '12자 이내로 입력해주세요.', added: '추가했어요:', removed: '삭제했어요:' }} />
    <p role="status">{tags.length} / 4개</p>
  </div>;
}`,
  },
  {
    id: 'meter',
    name: 'Meter',
    title: '지금의 상태를 정확하게 측정하기',
    category: 'display',
    release: '0.6.0',
    description:
      '저장 공간처럼 범위 안의 현재 측정값을 보여줘요. 실제 meter 요소로 진행률과 의미를 구분해요.',
    component: MeterDemo,
    code: `import * as React from 'react';
import { Meter, Slider } from '@toris-dev/ui';

export default function Example() {
  const [used, setUsed] = React.useState(6);
  return <div>
    <strong>{used} GB</strong>
    <Meter label="사용한 저장 공간" value={used} max={10} tone={used >= 8 ? 'warning' : 'primary'} aria-valuetext={used + ' GB 사용, 전체 10 GB'} />
    <Slider label="사용량 조절" value={used} onValueChange={setUsed} min={0} max={10} step={1} />
    <p>슬라이더로 측정값을 바꿔보세요.</p>
  </div>;
}`,
  },
];
