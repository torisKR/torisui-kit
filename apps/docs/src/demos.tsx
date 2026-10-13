import * as React from 'react';
import {
  ArrowRight,
  Plus,
  Heart,
  Check,
  Bell,
  Folder,
  MagnifyingGlass,
  Sliders,
  DotsThree,
  Sun,
  Copy,
} from '@phosphor-icons/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AspectRatio,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  HoverCard,
  IconButton,
  Input,
  Kbd,
  Label,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Separator,
  Sheet,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  useToast,
} from '@toris-dev/ui';
import './demo-styles.css';
import type { Demo } from './demo-types';
import { inputExtraDemos } from './demos-input-extra';
import { displayExtraDemos } from './demos-display-extra';
export type { Demo } from './demo-types';

type IconName =
  | 'arrow'
  | 'plus'
  | 'heart'
  | 'check'
  | 'bell'
  | 'folder'
  | 'search'
  | 'sliders'
  | 'more'
  | 'sun'
  | 'copy';
function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const icons = {
    arrow: ArrowRight,
    plus: Plus,
    heart: Heart,
    check: Check,
    bell: Bell,
    folder: Folder,
    search: MagnifyingGlass,
    sliders: Sliders,
    more: DotsThree,
    sun: Sun,
    copy: Copy,
  };
  const Component = icons[name];
  return <Component size={size} weight="regular" aria-hidden="true" />;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="demo-note" role="status">
      {children}
    </p>
  );
}

function ButtonDemo() {
  const [selected, setSelected] = React.useState('');
  return (
    <div className="demo-stack demo-buttons">
      <div className="demo-row">
        <Button
          variant="solid"
          rightIcon={<Icon name="arrow" />}
          onClick={() => setSelected('Solid')}
        >
          시작하기
        </Button>
        <Button variant="soft" onClick={() => setSelected('Soft')}>
          둘러보기
        </Button>
      </div>
      <div className="demo-row">
        <Button variant="outline" size="sm" onClick={() => setSelected('Outline')}>
          Outline
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setSelected('Ghost')}>
          Ghost
        </Button>
        <Button variant="glow" size="sm" onClick={() => setSelected('Glow')}>
          Glow
        </Button>
      </div>
      <Note>{selected ? `${selected} 버튼을 눌렀어요.` : '다섯 가지 스타일을 눌러보세요.'}</Note>
    </div>
  );
}

function IconButtonDemo() {
  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(0);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-row">
        <IconButton
          variant={liked ? 'solid' : 'outline'}
          aria-label={liked ? '좋아요 취소' : '좋아요'}
          aria-pressed={liked}
          onClick={() => setLiked(!liked)}
        >
          <Icon name="heart" />
        </IconButton>
        <IconButton variant="soft" aria-label="항목 추가" onClick={() => setCount(count + 1)}>
          <Icon name="plus" />
        </IconButton>
        <IconButton variant="ghost" aria-label="항목 수 초기화" onClick={() => setCount(0)}>
          <Icon name="more" />
        </IconButton>
      </div>
      <Note>
        {liked ? '마음에 들어요' : '좋아요를 남겨보세요'} · 추가한 항목 {count}개
      </Note>
    </div>
  );
}

function CardDemo() {
  const [saved, setSaved] = React.useState(false);
  return (
    <Card
      variant="glass"
      interactive
      className="demo-project-card"
      onClick={() => setSaved(!saved)}
      aria-label={saved ? '프로젝트 저장 취소' : '프로젝트 저장'}
      aria-pressed={saved}
    >
      <div className="demo-project-art" aria-hidden="true">
        <span />
        <span />
        <span />
        <i>t.</i>
      </div>
      <CardHeader>
        <div className="demo-between">
          <CardTitle>작은 아이디어, 큰 시작</CardTitle>
          <Badge tone={saved ? 'success' : 'primary'}>{saved ? '저장됨' : 'UI Kit'}</Badge>
        </div>
        <CardDescription>오늘의 프로젝트를 만들어보세요.</CardDescription>
      </CardHeader>
      <CardFooter>
        <span>클릭하여 {saved ? '저장 취소' : '저장'}</span>
        <Icon name={saved ? 'check' : 'arrow'} size={16} />
      </CardFooter>
    </Card>
  );
}

function InputDemo() {
  const [email, setEmail] = React.useState('');
  const invalid = email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div className="demo-stack">
      <Input
        label="이메일"
        type="email"
        placeholder="hello@toris.kr"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        helperText={
          email ? '사용할 수 있는 이메일 형식이에요.' : '입력하면 유효성 상태가 바뀌어요.'
        }
        error={invalid ? '이메일 형식을 확인해주세요.' : undefined}
      />
      <div className="demo-field-hint">
        <Icon name="check" size={14} /> 라벨 · 도움말 · 오류 상태
      </div>
    </div>
  );
}

function TextareaDemo() {
  const [text, setText] = React.useState('작지만 좋은 경험을 만들어요.');
  return (
    <div className="demo-stack">
      <Textarea
        label="한 줄 소개"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={80}
        rows={3}
        helperText={`${text.length} / 80자`}
      />
      <Note>글을 수정해보세요.</Note>
    </div>
  );
}

function SelectDemo() {
  const [value, setValue] = React.useState('design');
  const labels: Record<string, string> = {
    design: '디자인',
    frontend: '프론트엔드',
    product: '프로덕트',
  };
  return (
    <div className="demo-stack">
      <Select label="관심 분야" value={value} onChange={(event) => setValue(event.target.value)}>
        <option value="design">디자인</option>
        <option value="frontend">프론트엔드</option>
        <option value="product">프로덕트</option>
      </Select>
      <div className="demo-selection">
        <Badge tone="primary" dot>
          {labels[value]}
        </Badge>
        <span>분야를 선택했어요.</span>
      </div>
    </div>
  );
}

function CheckboxDemo() {
  const [tasks, setTasks] = React.useState([true, false, false]);
  const labels = ['아이디어 정리', '컴포넌트 선택', '프로토타입 완성'];
  const count = tasks.filter(Boolean).length;
  return (
    <div className="demo-stack demo-checklist">
      <Checkbox
        label="모두 선택"
        checked={count === tasks.length}
        indeterminate={count > 0 && count < tasks.length}
        onCheckedChange={(checked) => setTasks(tasks.map(() => checked))}
      />
      <Separator />
      {labels.map((label, index) => (
        <Checkbox
          key={label}
          label={label}
          checked={tasks[index]}
          onCheckedChange={(checked) =>
            setTasks(tasks.map((value, current) => (current === index ? checked : value)))
          }
        />
      ))}
      <Note>{count} / 3 완료</Note>
    </div>
  );
}

function RadioGroupDemo() {
  const [plan, setPlan] = React.useState('personal');
  return (
    <div className="demo-stack">
      <RadioGroup aria-label="작업 공간 선택" value={plan} onValueChange={setPlan}>
        <Radio value="personal" label="개인 작업 공간" description="혼자 자유롭게 시작하기" />
        <Radio value="team" label="팀 작업 공간" description="함께 아이디어를 만들기" />
      </RadioGroup>
      <Note>{plan === 'personal' ? '개인' : '팀'} 작업 공간을 선택했어요.</Note>
    </div>
  );
}

function SwitchDemo() {
  const [enabled, setEnabled] = React.useState(true);
  return (
    <div className="demo-stack">
      <div className="demo-setting-row">
        <span className="demo-icon-surface">
          <Icon name="bell" />
        </span>
        <div>
          <strong>새로운 소식</strong>
          <p>프로젝트 업데이트 알림</p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={setEnabled}
          aria-label="프로젝트 업데이트 알림"
        />
      </div>
      <Note>알림이 {enabled ? '켜져' : '꺼져'} 있어요.</Note>
    </div>
  );
}

function SliderDemo() {
  const [value, setValue] = React.useState(65);
  return (
    <div className="demo-stack">
      <div
        className="demo-brightness"
        style={{ '--demo-brightness': value / 100 } as React.CSSProperties}
        aria-hidden="true"
      >
        <div className="demo-orb" />
        <Icon name="sun" size={24} />
      </div>
      <div className="demo-between">
        <strong>밝기</strong>
        <output>{value}%</output>
      </div>
      <Slider label="밝기" value={value} onValueChange={setValue} />
      <Note>드래그하거나 방향키로 조절하세요.</Note>
    </div>
  );
}

function RatingDemo() {
  const [rating, setRating] = React.useState(4);
  const labels = [
    '별점을 선택해주세요',
    '아쉬워요',
    '괜찮아요',
    '좋아요',
    '마음에 들어요',
    '아주 좋아요',
  ];
  return (
    <div className="demo-stack demo-center">
      <span className="demo-eyebrow">HOW WAS YOUR EXPERIENCE?</span>
      <Rating label="컴포넌트 경험 평가" value={rating} onValueChange={setRating} size="lg" />
      <strong className="demo-rating-score">
        {rating}
        <span> / 5</span>
      </strong>
      <Note>{labels[rating]}</Note>
    </div>
  );
}

function ToggleDemo() {
  const [bold, setBold] = React.useState(true);
  const [italic, setItalic] = React.useState(false);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-row">
        <Toggle pressed={bold} onPressedChange={setBold} aria-label="굵게">
          <b>B</b>
        </Toggle>
        <Toggle pressed={italic} onPressedChange={setItalic} aria-label="기울임">
          <i>I</i>
        </Toggle>
      </div>
      <div
        className="demo-text-sample"
        style={{ fontWeight: bold ? 700 : 400, fontStyle: italic ? 'italic' : 'normal' }}
      >
        Make something good.
      </div>
      <Note>텍스트 스타일을 바꿔보세요.</Note>
    </div>
  );
}

function ToggleGroupDemo() {
  const [align, setAlign] = React.useState('center');
  return (
    <div className="demo-stack demo-center">
      <ToggleGroup
        type="single"
        value={align}
        onValueChange={(next) => next && setAlign(next)}
        aria-label="텍스트 정렬"
      >
        <ToggleGroupItem value="left">왼쪽</ToggleGroupItem>
        <ToggleGroupItem value="center">가운데</ToggleGroupItem>
        <ToggleGroupItem value="right">오른쪽</ToggleGroupItem>
      </ToggleGroup>
      <div
        className="demo-alignment"
        style={{ textAlign: align as React.CSSProperties['textAlign'] }}
      >
        <span>잘 정돈된 생각.</span>
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function BadgeDemo() {
  const [step, setStep] = React.useState(0);
  const states = [
    { tone: 'primary' as const, text: '새 프로젝트' },
    { tone: 'warning' as const, text: '진행 중' },
    { tone: 'success' as const, text: '완료' },
  ];
  const status = states[step]!;
  return (
    <div className="demo-stack demo-center">
      <div className="demo-row">
        <Badge variant="gradient">NEW</Badge>
        <Badge tone="success" dot>
          온라인
        </Badge>
        <Badge variant="outline">v0.6.0</Badge>
      </div>
      <div className="demo-badge-stage">
        <span>프로젝트 상태</span>
        <Badge tone={status.tone} dot>
          {status.text}
        </Badge>
      </div>
      <Button variant="ghost" size="sm" onClick={() => setStep((step + 1) % states.length)}>
        다음 상태 <Icon name="arrow" size={14} />
      </Button>
    </div>
  );
}

function AvatarDemo() {
  const [online, setOnline] = React.useState(true);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-avatar-group">
        <Avatar name="Toris Studio" size="lg" status={online ? 'online' : 'offline'} />
        <Avatar name="Min Ji" size="lg" status="busy" />
        <Avatar name="Jin Woo" size="lg" status="away" />
      </div>
      <div className="demo-profile-title">
        <strong>Toris Studio</strong>
        <span>{online ? '지금 함께 작업 중이에요' : '잠시 자리를 비웠어요'}</span>
      </div>
      <Switch label="온라인 상태" checked={online} onCheckedChange={setOnline} size="sm" />
    </div>
  );
}

function AlertDemo() {
  const [visible, setVisible] = React.useState(true);
  return (
    <div className="demo-stack">
      {visible ? (
        <Alert tone="success" title="변경사항을 저장했어요" onDismiss={() => setVisible(false)}>
          안심하고 다음 작업을 이어가세요.
        </Alert>
      ) : (
        <div className="demo-success-note">
          <Icon name="check" /> 알림을 닫았어요.
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={() => setVisible(true)}>
        알림 다시 보기
      </Button>
    </div>
  );
}

function ProgressDemo() {
  const [value, setValue] = React.useState(25);
  return (
    <div className="demo-stack">
      <div className="demo-between">
        <span>프로젝트 준비</span>
        <strong>{value}%</strong>
      </div>
      <Progress value={value} label="프로젝트 준비" size="lg" />
      <div className="demo-progress-steps">
        {['아이디어', '구성', '디자인', '완료'].map((step, index) => (
          <span key={step} data-complete={value >= (index + 1) * 25}>
            {step}
          </span>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => setValue(value === 100 ? 25 : value + 25)}>
        {value === 100 ? '다시 시작' : '다음 단계'}
        <Icon name="arrow" size={14} />
      </Button>
    </div>
  );
}

function EmptyStateDemo() {
  const [created, setCreated] = React.useState(false);
  return (
    <div className="demo-empty">
      {created ? (
        <div className="demo-stack">
          <div className="demo-created-project">
            <span className="demo-icon-surface">
              <Icon name="folder" />
            </span>
            <div>
              <strong>나의 첫 프로젝트</strong>
              <p>방금 만들었어요.</p>
            </div>
            <Badge tone="success">새 항목</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setCreated(false)}>
            프로젝트 비우기
          </Button>
        </div>
      ) : (
        <EmptyState
          icon={<Icon name="folder" size={26} />}
          title="가능성으로 가득한 빈 공간"
          description="첫 프로젝트를 만들어보세요."
          action={
            <Button
              size="sm"
              leftIcon={<Icon name="plus" size={14} />}
              onClick={() => setCreated(true)}
            >
              프로젝트 만들기
            </Button>
          }
        />
      )}
    </div>
  );
}

function SpinnerDemo() {
  const [loading, setLoading] = React.useState(true);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-loader-stage">
        {loading ? (
          <>
            <Spinner size="lg" label="프로젝트 준비 중" />
            <span>잠시 준비하고 있어요.</span>
          </>
        ) : (
          <>
            <span className="demo-done-icon">
              <Icon name="check" size={22} />
            </span>
            <span>준비를 마쳤어요.</span>
          </>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={() => setLoading(!loading)}>
        {loading ? '준비 완료로 바꾸기' : '로딩 다시 보기'}
      </Button>
    </div>
  );
}

function SkeletonDemo() {
  const [loading, setLoading] = React.useState(true);
  return (
    <div className="demo-stack">
      <div className="demo-skeleton-profile" aria-busy={loading}>
        {loading ? (
          <>
            <Skeleton variant="circle" width={44} height={44} />
            <div>
              <Skeleton variant="text" lines={2} />
            </div>
          </>
        ) : (
          <>
            <Avatar name="Toris Studio" size="lg" />
            <div>
              <strong>Toris Studio</strong>
              <p>작은 경험을 만드는 팀</p>
            </div>
          </>
        )}
      </div>
      {loading ? (
        <Skeleton variant="rect" height={46} />
      ) : (
        <div className="demo-loaded-note">함께 좋은 인터페이스를 만들어요.</div>
      )}
      <Button variant="ghost" size="sm" onClick={() => setLoading(!loading)}>
        {loading ? '콘텐츠 불러오기' : '스켈레톤 다시 보기'}
      </Button>
    </div>
  );
}

function SeparatorDemo() {
  const [vertical, setVertical] = React.useState(false);
  return (
    <div className="demo-stack demo-center">
      <div
        className={`demo-separator-example ${vertical ? 'demo-separator-example--vertical' : ''}`}
      >
        <span>아이디어</span>
        <Separator decorative={false} orientation={vertical ? 'vertical' : 'horizontal'} />
        <span>경험</span>
      </div>
      <Toggle pressed={vertical} onPressedChange={setVertical} size="sm">
        세로 구분선
      </Toggle>
    </div>
  );
}

function AccordionDemo() {
  return (
    <Accordion className="demo-accordion" defaultValue="start">
      <AccordionItem value="start">
        <AccordionTrigger>어디서 시작하면 좋을까요?</AccordionTrigger>
        <AccordionContent>
          마음에 드는 컴포넌트를 고르고 코드를 복사해 프로젝트에 넣어보세요.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="theme">
        <AccordionTrigger>내 색상으로 바꿀 수 있나요?</AccordionTrigger>
        <AccordionContent>
          --tori-primary 등의 CSS 변수를 바꾸면 브랜드에 맞게 사용할 수 있어요.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CollapsibleDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible className="demo-collapsible" open={open} onOpenChange={setOpen}>
      <div className="demo-between">
        <div>
          <strong>프로젝트 설정</strong>
          <p className="demo-note">추가 옵션을 확인하세요.</p>
        </div>
        <CollapsibleTrigger>{open ? '접기 −' : '펼치기 +'}</CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="demo-detail-line">
          <span>프레임워크</span>
          <Badge>React</Badge>
        </div>
        <div className="demo-detail-line">
          <span>테마</span>
          <Badge tone="primary">토큰 기반</Badge>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function TabsDemo() {
  return (
    <Tabs defaultValue="design" className="demo-tabs">
      <TabsList aria-label="작업 영역">
        <TabsTrigger value="design">디자인</TabsTrigger>
        <TabsTrigger value="code">코드</TabsTrigger>
        <TabsTrigger value="preview">미리보기</TabsTrigger>
      </TabsList>
      <TabsContent value="design">
        <span className="demo-tab-symbol" aria-hidden="true">
          ◈
        </span>
        <strong>생각을 형태로.</strong>
        <p>색상과 여백으로 경험을 구성하세요.</p>
      </TabsContent>
      <TabsContent value="code">
        <span className="demo-tab-symbol" aria-hidden="true">
          &lt;/&gt;
        </span>
        <strong>아이디어를 코드로.</strong>
        <p>React 컴포넌트로 바로 시작하세요.</p>
      </TabsContent>
      <TabsContent value="preview">
        <span className="demo-tab-symbol" aria-hidden="true">
          ◎
        </span>
        <strong>직접 눌러보세요.</strong>
        <p>클릭과 키보드로 동작을 확인하세요.</p>
      </TabsContent>
    </Tabs>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(1);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-page-items" aria-live="polite">
        {[1, 2, 3].map((offset) => (
          <span key={offset}>{String((page - 1) * 3 + offset).padStart(2, '0')}</span>
        ))}
      </div>
      <Pagination page={page} count={5} onPageChange={setPage} aria-label="예제 프로젝트 페이지" />
      <Note>
        {page}페이지 · 프로젝트 {(page - 1) * 3 + 1}–{page * 3}
      </Note>
    </div>
  );
}

function BreadcrumbDemo() {
  const [section, setSection] = React.useState('Button');
  return (
    <div className="demo-stack">
      <Breadcrumb aria-label="예제 경로">
        <BreadcrumbList>
          <BreadcrumbItem>
            {section === '홈' ? (
              <BreadcrumbPage>홈</BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href="#demo-home"
                onClick={(event) => {
                  event.preventDefault();
                  setSection('홈');
                }}
              >
                홈
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {section !== '홈' && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {section === '컴포넌트' ? (
                  <BreadcrumbPage>컴포넌트</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#demo-components"
                    onClick={(event) => {
                      event.preventDefault();
                      setSection('컴포넌트');
                    }}
                  >
                    컴포넌트
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          )}
          {section === 'Button' && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Button</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="demo-path-surface">
        <Icon name="folder" />
        <strong>{section}</strong>
        <span>현재 위치</span>
      </div>
      {section !== 'Button' && (
        <Button variant="ghost" size="sm" onClick={() => setSection('Button')}>
          Button으로 이동
        </Button>
      )}
    </div>
  );
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('나의 프로젝트');
  const [saved, setSaved] = React.useState('');
  return (
    <div className="demo-stack demo-center">
      <span className="demo-icon-surface demo-icon-surface--large">
        <Icon name="plus" size={24} />
      </span>
      <Button onClick={() => setOpen(true)}>프로젝트 만들기</Button>
      <Note>{saved ? `“${saved}” 프로젝트를 만들었어요.` : '클릭하면 대화상자가 열려요.'}</Note>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="새로운 시작"
        description="프로젝트의 이름을 정해주세요."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button
              disabled={!name.trim()}
              onClick={() => {
                setSaved(name.trim());
                setOpen(false);
              }}
            >
              만들기
            </Button>
          </>
        }
      >
        <Input
          label="프로젝트 이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
          data-autofocus
        />
      </Dialog>
    </div>
  );
}

function SheetDemo() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('all');
  const [selected, setSelected] = React.useState('all');
  const labels: Record<string, string> = {
    all: '모든 컴포넌트',
    form: '입력 컴포넌트',
    overlay: '오버레이 컴포넌트',
  };
  return (
    <div className="demo-stack demo-center">
      <div className="demo-filter-label">
        <Icon name="sliders" />
        <span>{labels[selected]}</span>
      </div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        필터 열기
      </Button>
      <Note>오른쪽 패널에서 옵션을 선택하세요.</Note>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="보고 싶은 컴포넌트"
        description="선택한 필터를 적용해보세요."
        side="right"
        footer={
          <Button
            onClick={() => {
              setSelected(value);
              setOpen(false);
            }}
          >
            필터 적용
          </Button>
        }
      >
        <RadioGroup aria-label="컴포넌트 필터" value={value} onValueChange={setValue}>
          {Object.entries(labels).map(([key, text]) => (
            <Radio key={key} value={key} label={text} />
          ))}
        </RadioGroup>
      </Sheet>
    </div>
  );
}

function PopoverDemo() {
  const [open, setOpen] = React.useState(false);
  const [color, setColor] = React.useState('violet');
  const colors = [
    { id: 'violet', name: '바이올렛', hex: '#9a83db' },
    { id: 'blue', name: '블루', hex: '#73a3d5' },
    { id: 'mint', name: '민트', hex: '#71b59b' },
  ];
  const selected = colors.find((item) => item.id === color)!;
  return (
    <div className="demo-stack demo-center">
      <div className="demo-color-orb" style={{ background: selected.hex }} aria-hidden="true" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">색상 선택</Button>
        </PopoverTrigger>
        <PopoverContent aria-label="테마 색상" className="demo-color-popover">
          <strong>오늘의 색상</strong>
          <div className="demo-row">
            {colors.map((item) => (
              <button
                className="demo-swatch"
                type="button"
                key={item.id}
                style={{ background: item.hex }}
                aria-label={item.name}
                aria-pressed={color === item.id}
                onClick={() => {
                  setColor(item.id);
                  setOpen(false);
                }}
              >
                {color === item.id && <Icon name="check" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Note>{selected.name}를 선택했어요.</Note>
    </div>
  );
}

function DropdownMenuDemo() {
  const [name, setName] = React.useState('Design project');
  const [archived, setArchived] = React.useState(false);
  const [message, setMessage] = React.useState('프로젝트 메뉴를 열어보세요.');
  return (
    <div className="demo-stack">
      <div className="demo-menu-project">
        <span className="demo-icon-surface">
          <Icon name="folder" />
        </span>
        <div>
          <strong>{name}</strong>
          <span>{archived ? '보관함' : '내 작업 공간'}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton variant="ghost" aria-label="프로젝트 메뉴">
              <Icon name="more" />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>프로젝트 관리</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                setName(name === 'Design project' ? '새로운 아이디어' : 'Design project');
                setMessage('프로젝트 이름을 바꿨어요.');
              }}
            >
              이름 바꾸기
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setName(`${name} 복사`);
                setMessage('이름에 복사 표시를 추가했어요.');
              }}
            >
              복사본 표시
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setArchived(!archived);
                setMessage(archived ? '작업 공간으로 옮겼어요.' : '보관함으로 옮겼어요.');
              }}
            >
              {archived ? '보관 해제' : '보관하기'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Note>{message}</Note>
    </div>
  );
}

function HoverCardDemo() {
  const [followed, setFollowed] = React.useState(false);
  return (
    <div className="demo-stack demo-center">
      <HoverCard
        openDelay={200}
        content={
          <div className="demo-hover-profile">
            <Avatar name="Toris Studio" size="lg" status="online" />
            <strong>Toris Studio</strong>
            <p>작은 아이디어를 좋은 경험으로 만들어요.</p>
            <Button
              size="sm"
              variant={followed ? 'outline' : 'solid'}
              onClick={() => setFollowed(!followed)}
            >
              {followed ? '팔로잉 취소' : '팔로우'}
            </Button>
          </div>
        }
      >
        <Button variant="ghost" className="demo-profile-trigger">
          <Avatar name="Toris Studio" />
          <span>@toris-studio</span>
        </Button>
      </HoverCard>
      <Note>
        {followed ? 'Toris Studio를 팔로우했어요.' : '마우스를 올리거나 Tab으로 포커스하세요.'}
      </Note>
    </div>
  );
}

function TooltipDemo() {
  const [saved, setSaved] = React.useState(false);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-row">
        <Tooltip content="마음에 드는 컴포넌트 저장" placement="top" delay={150}>
          <IconButton
            variant={saved ? 'solid' : 'outline'}
            aria-label={saved ? '저장 취소' : '컴포넌트 저장'}
            aria-pressed={saved}
            onClick={() => setSaved(!saved)}
          >
            <Icon name="heart" />
          </IconButton>
        </Tooltip>
        <Tooltip content="클릭하면 저장 상태가 초기화돼요" placement="bottom" delay={150}>
          <IconButton variant="soft" aria-label="저장 상태 초기화" onClick={() => setSaved(false)}>
            <Icon name="copy" />
          </IconButton>
        </Tooltip>
      </div>
      <Note>{saved ? '컴포넌트를 저장했어요.' : '아이콘에 마우스나 포커스를 올려보세요.'}</Note>
    </div>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="demo-stack demo-center">
      <span className="demo-toast-mark" aria-hidden="true">
        <Icon name="bell" size={24} />
      </span>
      <div className="demo-row">
        <Button
          variant="soft"
          size="sm"
          onClick={() =>
            toast.success('변경사항을 저장했어요.', { description: '이제 다음 작업을 이어가세요.' })
          }
        >
          성공 알림
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info('새로운 아이디어가 도착했어요.')}
        >
          안내 알림
        </Button>
      </div>
      <Note>화면 아래에 토스트가 나타나요.</Note>
    </div>
  );
}

function TableDemo() {
  const [ascending, setAscending] = React.useState(true);
  const rows = [
    { name: 'Button', category: '액션' },
    { name: 'Input', category: '입력' },
    { name: 'Dialog', category: '오버레이' },
  ].sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  return (
    <div className="demo-stack">
      <Table aria-label="컴포넌트 목록" className="demo-table">
        <TableHeader>
          <TableRow>
            <TableHead sort={ascending ? 'ascending' : 'descending'}>
              <button
                className="demo-sort-button"
                type="button"
                onClick={() => setAscending(!ascending)}
              >
                컴포넌트 {ascending ? '↑' : '↓'}
              </button>
            </TableHead>
            <TableHead>분류</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>
                <Badge tone="success" dot>
                  준비
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Note>컴포넌트 열을 눌러 정렬하세요.</Note>
    </div>
  );
}

function LabelDemo() {
  const id = React.useId();
  const [name, setName] = React.useState('');
  return (
    <div className="demo-stack">
      <Label htmlFor={id} required>
        프로젝트 이름
      </Label>
      <Input
        id={id}
        value={name}
        required
        placeholder="어떤 아이디어가 있나요?"
        onChange={(event) => setName(event.target.value)}
      />
      <Note>{name ? `“${name}” — 좋은 이름이에요.` : '라벨을 클릭하면 입력창에 포커스돼요.'}</Note>
    </div>
  );
}

function AspectRatioDemo() {
  const [square, setSquare] = React.useState(false);
  return (
    <div className="demo-stack demo-center">
      <div className="demo-ratio-wrap">
        <AspectRatio ratio={square ? 1 : 16 / 9} className="demo-ratio-art">
          <span className="demo-ratio-orbit" />
          <span className="demo-ratio-cube" />
          <strong>{square ? '1 : 1' : '16 : 9'}</strong>
        </AspectRatio>
      </div>
      <Toggle pressed={square} onPressedChange={setSquare} size="sm">
        정사각형으로 보기
      </Toggle>
    </div>
  );
}

function KbdDemo() {
  const [used, setUsed] = React.useState(false);
  return (
    <div className="demo-stack demo-center">
      <div
        className="demo-keyboard-zone"
        tabIndex={0}
        aria-label="단축키 체험: Enter 키를 누르세요"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            setUsed(true);
          }
        }}
      >
        <span>여기를 클릭하고</span>
        <Kbd>Enter</Kbd>
        <span>키를 누르세요</span>
      </div>
      <Note>{used ? '단축키를 실행했어요.' : '키보드 입력을 시각적으로 안내해요.'}</Note>
      {used && (
        <Button variant="ghost" size="sm" onClick={() => setUsed(false)}>
          다시 체험하기
        </Button>
      )}
    </div>
  );
}

function example(imports: string, body: string) {
  return `import * as React from 'react';\nimport { ${imports} } from '@toris-dev/ui';\n\nexport default function Example() {\n${body.trim()}\n}`;
}

export const demos: Demo[] = [
  {
    id: 'button',
    name: 'Button',
    title: '한 번의 클릭, 다음 단계로',
    category: 'action',
    component: ButtonDemo,
    description: 'Solid, Soft, Outline, Ghost, Glow. 다섯 가지 버튼 스타일을 직접 눌러보세요.',
    code: example(
      'Button',
      `  const [selected, setSelected] = React.useState('');
  return <div>
    <Button variant="solid" onClick={() => setSelected('Solid')}>시작하기</Button>
    <Button variant="soft" onClick={() => setSelected('Soft')}>둘러보기</Button>
    <Button variant="outline" size="sm" onClick={() => setSelected('Outline')}>Outline</Button>
    <Button variant="ghost" size="sm" onClick={() => setSelected('Ghost')}>Ghost</Button>
    <Button variant="glow" size="sm" onClick={() => setSelected('Glow')}>Glow</Button>
    <p role="status">{selected ? selected + ' 버튼을 눌렀어요.' : '다섯 가지 스타일을 눌러보세요.'}</p>
  </div>;`,
    ),
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    title: '작은 아이콘에 담긴 액션',
    category: 'action',
    component: IconButtonDemo,
    description: '좋아요를 토글하고 항목을 추가하세요. 아이콘 버튼은 aria-label로 동작을 알려줘요.',
    code: example(
      'IconButton',
      `  const [liked, setLiked] = React.useState(false);
  const [count, setCount] = React.useState(0);
  return <div>
    <IconButton variant={liked ? 'solid' : 'outline'} aria-label={liked ? '좋아요 취소' : '좋아요'} aria-pressed={liked} onClick={() => setLiked(!liked)}>♡</IconButton>
    <IconButton variant="soft" aria-label="항목 추가" onClick={() => setCount(count + 1)}>+</IconButton>
    <IconButton variant="ghost" aria-label="항목 수 초기화" onClick={() => setCount(0)}>…</IconButton>
    <p role="status">{liked ? '마음에 들어요' : '좋아요를 남겨보세요'} · 추가한 항목 {count}개</p>
  </div>;`,
    ),
  },
  {
    id: 'card',
    name: 'Card',
    title: '아이디어가 머무는 카드',
    category: 'display',
    component: CardDemo,
    description: 'Glass 카드에 헤더와 푸터를 조합했어요. 클릭하거나 Enter로 프로젝트를 저장하세요.',
    code: example(
      'Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge',
      `  const [saved, setSaved] = React.useState(false);
  return <Card variant="glass" interactive onClick={() => setSaved(!saved)} aria-label={saved ? '프로젝트 저장 취소' : '프로젝트 저장'} aria-pressed={saved}>
    <CardHeader>
      <CardTitle>작은 아이디어, 큰 시작</CardTitle>
      <CardDescription>오늘의 프로젝트를 만들어보세요.</CardDescription>
    </CardHeader>
    <CardContent><Badge tone={saved ? 'success' : 'primary'}>{saved ? '저장됨' : 'UI Kit'}</Badge></CardContent>
    <CardFooter>클릭하여 {saved ? '저장 취소' : '저장'}</CardFooter>
  </Card>;`,
    ),
  },
  {
    id: 'input',
    name: 'Input',
    title: '입력하는 순간, 자연스럽게',
    category: 'form',
    component: InputDemo,
    description:
      '이메일을 입력하면 도움말과 오류 상태가 바뀌어요. Input은 내부 Field로 라벨을 연결해요.',
    code: example(
      'Input',
      `  const [email, setEmail] = React.useState('');
  const invalid = email.length > 0 && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  return <Input label="이메일" type="email" placeholder="hello@toris.kr" value={email}
    onChange={(event) => setEmail(event.target.value)}
    helperText={email ? '사용할 수 있는 이메일 형식이에요.' : '입력하면 유효성 상태가 바뀌어요.'}
    error={invalid ? '이메일 형식을 확인해주세요.' : undefined} />;`,
    ),
  },
  {
    id: 'textarea',
    name: 'Textarea',
    title: '생각을 조금 더 길게',
    category: 'form',
    component: TextareaDemo,
    description: '여러 줄 입력과 글자 수 안내. 80자 안에서 소개를 자유롭게 바꿔보세요.',
    code: example(
      'Textarea',
      `  const [text, setText] = React.useState('작지만 좋은 경험을 만들어요.');
  return <Textarea label="한 줄 소개" value={text} onChange={(event) => setText(event.target.value)} maxLength={80} rows={3} helperText={text.length + ' / 80자'} />;`,
    ),
  },
  {
    id: 'select',
    name: 'Select',
    title: '나에게 맞는 선택',
    category: 'form',
    component: SelectDemo,
    description: '네이티브 선택창에 토리스 스타일을 입혔어요. 선택한 관심 분야를 바로 확인하세요.',
    code: example(
      'Select, Badge',
      `  const [value, setValue] = React.useState('design');
  const labels: Record<string, string> = { design: '디자인', frontend: '프론트엔드', product: '프로덕트' };
  return <div>
    <Select label="관심 분야" value={value} onChange={(event) => setValue(event.target.value)}>
      <option value="design">디자인</option><option value="frontend">프론트엔드</option><option value="product">프로덕트</option>
    </Select>
    <Badge tone="primary" dot>{labels[value]}</Badge>
  </div>;`,
    ),
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    title: '하나씩 체크하는 즐거움',
    category: 'form',
    component: CheckboxDemo,
    description: '체크리스트와 모두 선택을 연결했어요. 일부 선택 상태도 직접 확인할 수 있어요.',
    code: example(
      'Checkbox, Separator',
      `  const [tasks, setTasks] = React.useState([true, false, false]);
  const labels = ['아이디어 정리', '컴포넌트 선택', '프로토타입 완성'];
  const count = tasks.filter(Boolean).length;
  return <div>
    <Checkbox label="모두 선택" checked={count === tasks.length} indeterminate={count > 0 && count < tasks.length} onCheckedChange={(checked) => setTasks(tasks.map(() => checked))} />
    <Separator />
    {labels.map((label, index) => <Checkbox key={label} label={label} checked={tasks[index]} onCheckedChange={(checked) => setTasks(tasks.map((value, current) => current === index ? checked : value))} />)}
    <p role="status">{count} / 3 완료</p>
  </div>;`,
    ),
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    title: '선택은 하나, 분명하게',
    category: 'form',
    component: RadioGroupDemo,
    description:
      '개인과 팀 작업 공간 중 하나를 고르세요. 방향키로 선택할 수 있는 라디오 그룹이에요.',
    code: example(
      'RadioGroup, Radio',
      `  const [plan, setPlan] = React.useState('personal');
  return <div>
    <RadioGroup aria-label="작업 공간 선택" value={plan} onValueChange={setPlan}>
      <Radio value="personal" label="개인 작업 공간" description="혼자 자유롭게 시작하기" />
      <Radio value="team" label="팀 작업 공간" description="함께 아이디어를 만들기" />
    </RadioGroup>
    <p role="status">{plan === 'personal' ? '개인' : '팀'} 작업 공간을 선택했어요.</p>
  </div>;`,
    ),
  },
  {
    id: 'switch',
    name: 'Switch',
    title: '켜고 끄는 간단한 설정',
    category: 'form',
    component: SwitchDemo,
    description:
      '프로젝트 알림 설정을 토글하세요. 상태는 색상과 위치, 접근성 속성으로 함께 전달돼요.',
    code: example(
      'Switch',
      `  const [enabled, setEnabled] = React.useState(true);
  return <div>
    <Switch label="프로젝트 업데이트 알림" checked={enabled} onCheckedChange={setEnabled} />
    <p role="status">알림이 {enabled ? '켜져' : '꺼져'} 있어요.</p>
  </div>;`,
    ),
  },
  {
    id: 'slider',
    name: 'Slider',
    title: '감각적으로 조절하는 값',
    category: 'form',
    component: SliderDemo,
    description: '슬라이더를 움직이면 밝기와 숫자가 함께 바뀌어요. 터치와 방향키도 지원해요.',
    code: example(
      'Slider',
      `  const [value, setValue] = React.useState(65);
  return <div>
    <div style={{ opacity: value / 100, background: '#9a83db', height: 80 }} aria-hidden="true" />
    <output>밝기 {value}%</output>
    <Slider label="밝기" value={value} onValueChange={setValue} />
  </div>;`,
    ),
  },
  {
    id: 'rating',
    name: 'Rating',
    title: '별 다섯 개로 전하는 마음',
    category: 'form',
    component: RatingDemo,
    description:
      '별을 눌러 평가하세요. 같은 별을 다시 누르면 초기화되고 방향키로도 조절할 수 있어요.',
    code: example(
      'Rating',
      `  const [rating, setRating] = React.useState(4);
  const labels = ['별점을 선택해주세요', '아쉬워요', '괜찮아요', '좋아요', '마음에 들어요', '아주 좋아요'];
  return <div>
    <Rating label="컴포넌트 경험 평가" value={rating} onValueChange={setRating} size="lg" />
    <strong>{rating} / 5</strong><p role="status">{labels[rating]}</p>
  </div>;`,
    ),
  },
  {
    id: 'toggle',
    name: 'Toggle',
    title: '누르는 순간 스타일 변경',
    category: 'action',
    component: ToggleDemo,
    description: '굵게와 기울임을 독립적으로 바꿔보세요. 눌림 상태를 유지하는 버튼이에요.',
    code: example(
      'Toggle',
      `  const [bold, setBold] = React.useState(true);
  const [italic, setItalic] = React.useState(false);
  return <div>
    <Toggle pressed={bold} onPressedChange={setBold} aria-label="굵게"><b>B</b></Toggle>
    <Toggle pressed={italic} onPressedChange={setItalic} aria-label="기울임"><i>I</i></Toggle>
    <p style={{ fontWeight: bold ? 700 : 400, fontStyle: italic ? 'italic' : 'normal' }}>Make something good.</p>
  </div>;`,
    ),
  },
  {
    id: 'toggle-group',
    name: 'ToggleGroup',
    title: '가지런히 연결된 선택',
    category: 'action',
    component: ToggleGroupDemo,
    description: '여러 토글을 한 그룹으로 묶었어요. 선택한 방향에 맞게 텍스트가 정렬돼요.',
    code: example(
      'ToggleGroup, ToggleGroupItem',
      `  const [align, setAlign] = React.useState('center');
  return <div>
    <ToggleGroup type="single" value={align} onValueChange={(next) => next && setAlign(next)} aria-label="텍스트 정렬">
      <ToggleGroupItem value="left">왼쪽</ToggleGroupItem><ToggleGroupItem value="center">가운데</ToggleGroupItem><ToggleGroupItem value="right">오른쪽</ToggleGroupItem>
    </ToggleGroup>
    <p style={{ textAlign: align as React.CSSProperties['textAlign'] }}>잘 정돈된 생각.</p>
  </div>;`,
    ),
  },
  {
    id: 'badge',
    name: 'Badge',
    title: '작은 태그, 분명한 상태',
    category: 'display',
    component: BadgeDemo,
    description:
      '상태, 버전, 새 항목을 짧게 전달하세요. 다음 상태 버튼으로 배지 색상을 바꿔보세요.',
    code: example(
      'Badge, Button',
      `  const [step, setStep] = React.useState(0);
  const states = [{ tone: 'primary' as const, text: '새 프로젝트' }, { tone: 'warning' as const, text: '진행 중' }, { tone: 'success' as const, text: '완료' }];
  const status = states[step]!;
  return <div>
    <Badge variant="gradient">NEW</Badge><Badge tone="success" dot>온라인</Badge><Badge variant="outline">v0.6.0</Badge>
    <Badge tone={status.tone} dot>{status.text}</Badge>
    <Button variant="ghost" size="sm" onClick={() => setStep((step + 1) % states.length)}>다음 상태</Button>
  </div>;`,
    ),
  },
  {
    id: 'avatar',
    name: 'Avatar',
    title: '우리 팀의 작은 얼굴들',
    category: 'display',
    component: AvatarDemo,
    description: '이미지가 없어도 이름의 이니셜이 보여요. 온라인 상태를 바꿔 상태 점을 확인하세요.',
    code: example(
      'Avatar, Switch',
      `  const [online, setOnline] = React.useState(true);
  return <div>
    <Avatar name="Toris Studio" size="lg" status={online ? 'online' : 'offline'} />
    <Avatar name="Min Ji" size="lg" status="busy" /><Avatar name="Jin Woo" size="lg" status="away" />
    <Switch label="온라인 상태" checked={online} onCheckedChange={setOnline} size="sm" />
  </div>;`,
    ),
  },
  {
    id: 'alert',
    name: 'Alert',
    title: '필요한 순간의 명확한 안내',
    category: 'feedback',
    component: AlertDemo,
    description: '페이지 안에서 결과를 전달하는 알림이에요. 닫기와 다시 보기를 직접 체험하세요.',
    code: example(
      'Alert, Button',
      `  const [visible, setVisible] = React.useState(true);
  return <div>
    {visible ? <Alert tone="success" title="변경사항을 저장했어요" onDismiss={() => setVisible(false)}>안심하고 다음 작업을 이어가세요.</Alert> : <p role="status">알림을 닫았어요.</p>}
    <Button variant="ghost" size="sm" onClick={() => setVisible(true)}>알림 다시 보기</Button>
  </div>;`,
    ),
  },
  {
    id: 'progress',
    name: 'Progress',
    title: '조금씩 완성되어 가는 과정',
    category: 'feedback',
    component: ProgressDemo,
    description: '다음 단계 버튼으로 진행률을 올려보세요. 수치와 진행 막대가 함께 업데이트돼요.',
    code: example(
      'Progress, Button',
      `  const [value, setValue] = React.useState(25);
  return <div>
    <strong>프로젝트 준비 {value}%</strong>
    <Progress value={value} label="프로젝트 준비" size="lg" />
    <Button variant="outline" size="sm" onClick={() => setValue(value === 100 ? 25 : value + 25)}>{value === 100 ? '다시 시작' : '다음 단계'}</Button>
  </div>;`,
    ),
  },
  {
    id: 'empty-state',
    name: 'EmptyState',
    title: '빈 공간에도 좋은 시작',
    category: 'feedback',
    component: EmptyStateDemo,
    description:
      '빈 목록을 다음 행동으로 연결하세요. 프로젝트를 만들고 비우며 상태 변화를 확인하세요.',
    code: example(
      'EmptyState, Button, Badge',
      `  const [created, setCreated] = React.useState(false);
  return created ? <div>
    <strong>나의 첫 프로젝트</strong><Badge tone="success">새 항목</Badge>
    <Button variant="ghost" size="sm" onClick={() => setCreated(false)}>프로젝트 비우기</Button>
  </div> : <EmptyState icon={<span>＋</span>} title="가능성으로 가득한 빈 공간" description="첫 프로젝트를 만들어보세요." action={<Button size="sm" onClick={() => setCreated(true)}>프로젝트 만들기</Button>} />;`,
    ),
  },
  {
    id: 'spinner',
    name: 'Spinner',
    title: '기다림에도 작은 배려',
    category: 'feedback',
    component: SpinnerDemo,
    description:
      '회전하는 로딩 표시와 완료 상태를 바꿔보세요. 스크린리더에도 준비 중임을 알려줘요.',
    code: example(
      'Spinner, Button',
      `  const [loading, setLoading] = React.useState(true);
  return <div>
    {loading ? <><Spinner size="lg" label="프로젝트 준비 중" /><p>잠시 준비하고 있어요.</p></> : <p role="status">준비를 마쳤어요.</p>}
    <Button variant="outline" size="sm" onClick={() => setLoading(!loading)}>{loading ? '준비 완료로 바꾸기' : '로딩 다시 보기'}</Button>
  </div>;`,
    ),
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    title: '콘텐츠가 오기 전의 실루엣',
    category: 'feedback',
    component: SkeletonDemo,
    description: '프로필 로딩 중 보여줄 자리 표시자예요. 콘텐츠 불러오기로 실제 화면과 비교하세요.',
    code: example(
      'Skeleton, Avatar, Button',
      `  const [loading, setLoading] = React.useState(true);
  return <div>
    <div aria-busy={loading}>{loading ? <><Skeleton variant="circle" width={44} height={44} /><Skeleton variant="text" lines={2} /></> : <><Avatar name="Toris Studio" size="lg" /><strong>Toris Studio</strong><p>작은 경험을 만드는 팀</p></>}</div>
    {loading ? <Skeleton variant="rect" height={46} /> : <p>함께 좋은 인터페이스를 만들어요.</p>}
    <Button variant="ghost" size="sm" onClick={() => setLoading(!loading)}>{loading ? '콘텐츠 불러오기' : '스켈레톤 다시 보기'}</Button>
  </div>;`,
    ),
  },
  {
    id: 'separator',
    name: 'Separator',
    title: '생각과 생각 사이의 여백',
    category: 'display',
    component: SeparatorDemo,
    description:
      '가로와 세로 구분선을 전환해보세요. 의미 있는 경계에는 decorative=false를 사용해요.',
    code: example(
      'Separator, Toggle',
      `  const [vertical, setVertical] = React.useState(false);
  return <div>
    <div style={{ display: 'flex', flexDirection: vertical ? 'row' : 'column', alignItems: 'center', gap: 16, height: 72 }}>
      <span>아이디어</span><Separator decorative={false} orientation={vertical ? 'vertical' : 'horizontal'} /><span>경험</span>
    </div>
    <Toggle pressed={vertical} onPressedChange={setVertical} size="sm">세로 구분선</Toggle>
  </div>;`,
    ),
  },
  {
    id: 'accordion',
    name: 'Accordion',
    title: '궁금한 만큼만 펼쳐보기',
    category: 'navigation',
    component: AccordionDemo,
    description: '항목을 누르면 내용이 펼쳐지고 다른 항목은 접혀요. FAQ나 설명 목록에 활용하세요.',
    code: example(
      'Accordion, AccordionItem, AccordionTrigger, AccordionContent',
      `  return <Accordion defaultValue="start">
    <AccordionItem value="start"><AccordionTrigger>어디서 시작하면 좋을까요?</AccordionTrigger><AccordionContent>마음에 드는 컴포넌트를 고르고 코드를 복사해 프로젝트에 넣어보세요.</AccordionContent></AccordionItem>
    <AccordionItem value="theme"><AccordionTrigger>내 색상으로 바꿀 수 있나요?</AccordionTrigger><AccordionContent>--tori-primary 등의 CSS 변수를 바꾸면 브랜드에 맞게 사용할 수 있어요.</AccordionContent></AccordionItem>
  </Accordion>;`,
    ),
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    title: '필요할 때만 더 자세하게',
    category: 'navigation',
    component: CollapsibleDemo,
    description:
      '독립적인 설정 섹션을 펼치고 접으세요. 제목과 추가 정보를 분리해 깔끔하게 보여줘요.',
    code: example(
      'Collapsible, CollapsibleTrigger, CollapsibleContent, Badge',
      `  const [open, setOpen] = React.useState(false);
  return <Collapsible open={open} onOpenChange={setOpen}>
    <strong>프로젝트 설정</strong><CollapsibleTrigger>{open ? '접기 −' : '펼치기 +'}</CollapsibleTrigger>
    <CollapsibleContent><p>프레임워크 <Badge>React</Badge></p><p>테마 <Badge tone="primary">토큰 기반</Badge></p></CollapsibleContent>
  </Collapsible>;`,
    ),
  },
  {
    id: 'tabs',
    name: 'Tabs',
    title: '같은 공간, 다른 관점',
    category: 'navigation',
    component: TabsDemo,
    description: '디자인, 코드, 미리보기 탭을 전환하세요. 방향키로도 패널을 이동할 수 있어요.',
    code: example(
      'Tabs, TabsList, TabsTrigger, TabsContent',
      `  return <Tabs defaultValue="design">
    <TabsList aria-label="작업 영역"><TabsTrigger value="design">디자인</TabsTrigger><TabsTrigger value="code">코드</TabsTrigger><TabsTrigger value="preview">미리보기</TabsTrigger></TabsList>
    <TabsContent value="design"><strong>생각을 형태로.</strong><p>색상과 여백으로 경험을 구성하세요.</p></TabsContent>
    <TabsContent value="code"><strong>아이디어를 코드로.</strong><p>React 컴포넌트로 바로 시작하세요.</p></TabsContent>
    <TabsContent value="preview"><strong>직접 눌러보세요.</strong><p>클릭과 키보드로 동작을 확인하세요.</p></TabsContent>
  </Tabs>;`,
    ),
  },
  {
    id: 'pagination',
    name: 'Pagination',
    title: '다음 페이지에도 이어지는 발견',
    category: 'navigation',
    component: PaginationDemo,
    description: '페이지 번호와 앞뒤 이동 버튼을 눌러 프로젝트 번호가 바뀌는 것을 확인하세요.',
    code: example(
      'Pagination',
      `  const [page, setPage] = React.useState(1);
  return <div>
    <div aria-live="polite">{[1, 2, 3].map((offset) => <span key={offset}>{String((page - 1) * 3 + offset).padStart(2, '0')} </span>)}</div>
    <Pagination page={page} count={5} onPageChange={setPage} aria-label="예제 프로젝트 페이지" />
    <p>{page}페이지 · 프로젝트 {(page - 1) * 3 + 1}–{page * 3}</p>
  </div>;`,
    ),
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    title: '지금 어디에 있는지 한눈에',
    category: 'navigation',
    component: BreadcrumbDemo,
    description: '홈과 컴포넌트를 눌러 상위 경로로 이동하세요. 현재 위치를 분명하게 표시해요.',
    code: example(
      'Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, Button',
      `  const [section, setSection] = React.useState('Button');
  return <div>
    <Breadcrumb aria-label="예제 경로"><BreadcrumbList>
      <BreadcrumbItem>{section === '홈' ? <BreadcrumbPage>홈</BreadcrumbPage> : <BreadcrumbLink href="#demo-home" onClick={(event) => { event.preventDefault(); setSection('홈'); }}>홈</BreadcrumbLink>}</BreadcrumbItem>
      {section !== '홈' && <><BreadcrumbSeparator /><BreadcrumbItem>{section === '컴포넌트' ? <BreadcrumbPage>컴포넌트</BreadcrumbPage> : <BreadcrumbLink href="#demo-components" onClick={(event) => { event.preventDefault(); setSection('컴포넌트'); }}>컴포넌트</BreadcrumbLink>}</BreadcrumbItem></>}
      {section === 'Button' && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem></>}
    </BreadcrumbList></Breadcrumb>
    <p>현재 위치: {section}</p>
    {section !== 'Button' && <Button variant="ghost" size="sm" onClick={() => setSection('Button')}>Button으로 이동</Button>}
  </div>;`,
    ),
  },
  {
    id: 'dialog',
    name: 'Dialog',
    title: '하나의 결정에 집중하는 공간',
    category: 'overlay',
    component: DialogDemo,
    description:
      '프로젝트 만들기를 누르고 이름을 입력하세요. 확인과 취소, Escape 닫기를 체험할 수 있어요.',
    code: example(
      'Dialog, Button, Input',
      `  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('나의 프로젝트');
  const [saved, setSaved] = React.useState('');
  return <div>
    <Button onClick={() => setOpen(true)}>프로젝트 만들기</Button>
    <p role="status">{saved ? '“' + saved + '” 프로젝트를 만들었어요.' : '클릭하면 대화상자가 열려요.'}</p>
    <Dialog open={open} onOpenChange={setOpen} title="새로운 시작" description="프로젝트의 이름을 정해주세요." size="sm" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>취소</Button><Button disabled={!name.trim()} onClick={() => { setSaved(name.trim()); setOpen(false); }}>만들기</Button></>}>
      <Input label="프로젝트 이름" value={name} onChange={(event) => setName(event.target.value)} data-autofocus />
    </Dialog>
  </div>;`,
    ),
  },
  {
    id: 'sheet',
    name: 'Sheet',
    title: '옆에서 살며시 열리는 설정',
    category: 'overlay',
    component: SheetDemo,
    description: '화면 가장자리에서 열리는 모달 패널이에요. 필터를 고르고 적용해보세요.',
    code: example(
      'Sheet, Button, RadioGroup, Radio',
      `  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('all');
  const [selected, setSelected] = React.useState('all');
  const labels: Record<string, string> = { all: '모든 컴포넌트', form: '입력 컴포넌트', overlay: '오버레이 컴포넌트' };
  return <div>
    <p role="status">{labels[selected]}</p><Button variant="outline" onClick={() => setOpen(true)}>필터 열기</Button>
    <Sheet open={open} onOpenChange={setOpen} title="보고 싶은 컴포넌트" description="선택한 필터를 적용해보세요." side="right" footer={<Button onClick={() => { setSelected(value); setOpen(false); }}>필터 적용</Button>}>
      <RadioGroup aria-label="컴포넌트 필터" value={value} onValueChange={setValue}>{Object.entries(labels).map(([key, text]) => <Radio key={key} value={key} label={text} />)}</RadioGroup>
    </Sheet>
  </div>;`,
    ),
  },
  {
    id: 'popover',
    name: 'Popover',
    title: '클릭한 자리에서 바로 선택',
    category: 'overlay',
    component: PopoverDemo,
    description:
      '작은 색상 선택 패널이 버튼 옆에 열려요. 색상을 선택하면 미리보기 구체가 바뀌어요.',
    code: example(
      'Popover, PopoverTrigger, PopoverContent, Button',
      `  const [open, setOpen] = React.useState(false);
  const [color, setColor] = React.useState('violet');
  const colors = [{ id: 'violet', name: '바이올렛', hex: '#9a83db' }, { id: 'blue', name: '블루', hex: '#73a3d5' }, { id: 'mint', name: '민트', hex: '#71b59b' }];
  const selected = colors.find((item) => item.id === color)!;
  return <div>
    <div style={{ width: 48, height: 48, borderRadius: '50%', background: selected.hex }} aria-hidden="true" />
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="outline">색상 선택</Button></PopoverTrigger>
      <PopoverContent aria-label="테마 색상"><strong>오늘의 색상</strong>{colors.map((item) => <button type="button" key={item.id} style={{ background: item.hex }} aria-pressed={color === item.id} onClick={() => { setColor(item.id); setOpen(false); }}>{item.name}</button>)}</PopoverContent>
    </Popover>
    <p role="status">{selected.name}를 선택했어요.</p>
  </div>;`,
    ),
  },
  {
    id: 'dropdown-menu',
    name: 'DropdownMenu',
    title: '관련 액션을 한 곳에',
    category: 'overlay',
    component: DropdownMenuDemo,
    description:
      '프로젝트 메뉴에서 이름과 보관 상태를 바꿔보세요. 방향키로 항목을 선택할 수 있어요.',
    code: example(
      'DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, IconButton',
      `  const [name, setName] = React.useState('Design project');
  const [archived, setArchived] = React.useState(false);
  const [message, setMessage] = React.useState('프로젝트 메뉴를 열어보세요.');
  return <div>
    <strong>{name}</strong><p>{archived ? '보관함' : '내 작업 공간'}</p>
    <DropdownMenu><DropdownMenuTrigger asChild><IconButton variant="ghost" aria-label="프로젝트 메뉴">…</IconButton></DropdownMenuTrigger>
      <DropdownMenuContent><DropdownMenuLabel>프로젝트 관리</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => { setName(name === 'Design project' ? '새로운 아이디어' : 'Design project'); setMessage('프로젝트 이름을 바꿨어요.'); }}>이름 바꾸기</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { setName(name + ' 복사'); setMessage('이름에 복사 표시를 추가했어요.'); }}>복사본 표시</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { setArchived(!archived); setMessage(archived ? '작업 공간으로 옮겼어요.' : '보관함으로 옮겼어요.'); }}>{archived ? '보관 해제' : '보관하기'}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu><p role="status">{message}</p>
  </div>;`,
    ),
  },
  {
    id: 'hover-card',
    name: 'HoverCard',
    title: '관심을 올리면 더 깊은 정보',
    category: 'overlay',
    component: HoverCardDemo,
    description: '프로필에 마우스를 올리거나 포커스하세요. 펼쳐진 카드에서 팔로우도 할 수 있어요.',
    code: example(
      'HoverCard, Avatar, Button',
      `  const [followed, setFollowed] = React.useState(false);
  return <div>
    <HoverCard openDelay={200} content={<div><Avatar name="Toris Studio" size="lg" status="online" /><strong>Toris Studio</strong><p>작은 아이디어를 좋은 경험으로 만들어요.</p><Button size="sm" variant={followed ? 'outline' : 'solid'} onClick={() => setFollowed(!followed)}>{followed ? '팔로잉 취소' : '팔로우'}</Button></div>}>
      <Button variant="ghost"><Avatar name="Toris Studio" /> @toris-studio</Button>
    </HoverCard>
    <p role="status">{followed ? 'Toris Studio를 팔로우했어요.' : '마우스를 올리거나 Tab으로 포커스하세요.'}</p>
  </div>;`,
    ),
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    title: '작은 힌트가 필요한 순간',
    category: 'overlay',
    component: TooltipDemo,
    description:
      '아이콘에 마우스나 포커스를 올리면 설명이 나타나요. 버튼을 눌러 저장 상태도 바꿔보세요.',
    code: example(
      'Tooltip, IconButton',
      `  const [saved, setSaved] = React.useState(false);
  return <div>
    <Tooltip content="마음에 드는 컴포넌트 저장" placement="top" delay={150}><IconButton variant={saved ? 'solid' : 'outline'} aria-label={saved ? '저장 취소' : '컴포넌트 저장'} aria-pressed={saved} onClick={() => setSaved(!saved)}>♡</IconButton></Tooltip>
    <Tooltip content="클릭하면 저장 상태가 초기화돼요" placement="bottom" delay={150}><IconButton variant="soft" aria-label="저장 상태 초기화" onClick={() => setSaved(false)}>↺</IconButton></Tooltip>
    <p role="status">{saved ? '컴포넌트를 저장했어요.' : '아이콘에 마우스나 포커스를 올려보세요.'}</p>
  </div>;`,
    ),
  },
  {
    id: 'toast',
    name: 'Toast',
    title: '작업 흐름을 이어주는 알림',
    category: 'feedback',
    component: ToastDemo,
    description:
      '성공과 안내 토스트를 띄워보세요. 이 예제는 ToriProvider 안에서 useToast를 사용해요.',
    code: `import { ToriProvider, Button, useToast } from '@toris-dev/ui';

function ToastExample() {
  const { toast } = useToast();
  return <div>
    <Button variant="soft" size="sm" onClick={() => toast.success('변경사항을 저장했어요.', { description: '이제 다음 작업을 이어가세요.' })}>성공 알림</Button>
    <Button variant="outline" size="sm" onClick={() => toast.info('새로운 아이디어가 도착했어요.')}>안내 알림</Button>
  </div>;
}

export default function Example() {
  return <ToriProvider><ToastExample /></ToriProvider>;
}`,
  },
  {
    id: 'table',
    name: 'Table',
    title: '정보를 차분하게 정리하는 표',
    category: 'display',
    component: TableDemo,
    description:
      '컴포넌트 열 제목을 눌러 오름차순과 내림차순을 전환하세요. 실제 표 구조를 사용해요.',
    code: example(
      'Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge',
      `  const [ascending, setAscending] = React.useState(true);
  const rows = [{ name: 'Button', category: '액션' }, { name: 'Input', category: '입력' }, { name: 'Dialog', category: '오버레이' }].sort((a, b) => ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  return <Table aria-label="컴포넌트 목록">
    <TableHeader><TableRow><TableHead sort={ascending ? 'ascending' : 'descending'}><button type="button" onClick={() => setAscending(!ascending)}>컴포넌트 {ascending ? '↑' : '↓'}</button></TableHead><TableHead>분류</TableHead><TableHead>상태</TableHead></TableRow></TableHeader>
    <TableBody>{rows.map((row) => <TableRow key={row.name}><TableCell>{row.name}</TableCell><TableCell>{row.category}</TableCell><TableCell><Badge tone="success" dot>준비</Badge></TableCell></TableRow>)}</TableBody>
  </Table>;`,
    ),
  },
  {
    id: 'label',
    name: 'Label',
    title: '입력의 목적을 분명하게',
    category: 'form',
    component: LabelDemo,
    description:
      '필수 표시가 있는 라벨을 클릭하면 연결된 입력창에 포커스돼요. 프로젝트 이름을 적어보세요.',
    code: example(
      'Label, Input',
      `  const id = React.useId();
  const [name, setName] = React.useState('');
  return <div>
    <Label htmlFor={id} required>프로젝트 이름</Label>
    <Input id={id} value={name} required placeholder="어떤 아이디어가 있나요?" onChange={(event) => setName(event.target.value)} />
    <p role="status">{name ? '“' + name + '” — 좋은 이름이에요.' : '라벨을 클릭하면 입력창에 포커스돼요.'}</p>
  </div>;`,
    ),
  },
  {
    id: 'aspect-ratio',
    name: 'AspectRatio',
    title: '어떤 화면에서도 같은 비율',
    category: 'display',
    component: AspectRatioDemo,
    description:
      '16:9와 정사각형을 전환해보세요. 이미지와 미디어의 비율을 일정하게 유지하는 컨테이너예요.',
    code: example(
      'AspectRatio, Toggle',
      `  const [square, setSquare] = React.useState(false);
  return <div style={{ maxWidth: 240 }}>
    <AspectRatio ratio={square ? 1 : 16 / 9} style={{ display: 'grid', placeItems: 'center', background: 'var(--tori-gradient-primary)', borderRadius: 12 }}>
      <strong>{square ? '1 : 1' : '16 : 9'}</strong>
    </AspectRatio>
    <Toggle pressed={square} onPressedChange={setSquare} size="sm">정사각형으로 보기</Toggle>
  </div>;`,
    ),
  },
  {
    id: 'kbd',
    name: 'Kbd',
    title: '키보드도 하나의 인터페이스',
    category: 'display',
    component: KbdDemo,
    description: '영역을 클릭하고 Enter를 눌러보세요. 단축키를 전달하는 시맨틱 키캡 컴포넌트예요.',
    code: example(
      'Kbd, Button',
      `  const [used, setUsed] = React.useState(false);
  return <div>
    <div tabIndex={0} aria-label="단축키 체험: Enter 키를 누르세요" onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); setUsed(true); } }}>
      여기를 클릭하고 <Kbd>Enter</Kbd> 키를 누르세요
    </div>
    <p role="status">{used ? '단축키를 실행했어요.' : '키보드 입력을 시각적으로 안내해요.'}</p>
    {used && <Button variant="ghost" size="sm" onClick={() => setUsed(false)}>다시 체험하기</Button>}
  </div>;`,
    ),
  },
  ...inputExtraDemos,
  ...displayExtraDemos,
];
