import * as React from 'react';
import { Dialog, ToriProvider, useTheme } from '@toris-dev/ui';
import {
  ArrowRight,
  ArrowsOutSimple,
  MagnifyingGlass,
  Copy,
  Sun,
  Moon,
  X,
  ArrowCounterClockwise,
  Check,
} from '@phosphor-icons/react';
import { demos, type Demo } from './demos';
import { installCommand, packageVersion } from './package-info';

type Category = 'all' | Demo['category'];
type ViewState = { category: Category; query: string; component: string | null };
type PreviewPreferences = {
  brand: 'cobalt' | 'forest' | 'coral';
  corners: 'round' | 'compact';
  viewport: 'fluid' | 'mobile';
};
const defaultPreferences: PreviewPreferences = {
  brand: 'cobalt',
  corners: 'round',
  viewport: 'fluid',
};
const brands = {
  cobalt: {
    label: '코발트',
    light: '49 70 208',
    strong: '34 50 164',
    dark: '158 175 255',
    darkStrong: '125 146 245',
    darkForeground: '17 24 55',
  },
  forest: {
    label: '포레스트',
    light: '36 105 70',
    strong: '23 77 50',
    dark: '128 208 167',
    darkStrong: '105 187 145',
    darkForeground: '13 38 23',
  },
  coral: {
    label: '코랄',
    light: '181 73 52',
    strong: '148 49 31',
    dark: '255 168 147',
    darkStrong: '236 136 116',
    darkForeground: '48 23 18',
  },
};

function readPreviewPreferences(): PreviewPreferences {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem('torisui-preview') ?? 'null');
    if (!saved || typeof saved !== 'object') return defaultPreferences;
    const value = saved as Partial<PreviewPreferences>;
    return {
      brand: value.brand === 'forest' || value.brand === 'coral' ? value.brand : 'cobalt',
      corners: value.corners === 'compact' ? 'compact' : 'round',
      viewport: value.viewport === 'mobile' ? 'mobile' : 'fluid',
    };
  } catch {
    return defaultPreferences;
  }
}

function usePreviewPreferences() {
  const [preferences, setPreferences] = React.useState(readPreviewPreferences);
  const { resolvedTheme } = useTheme();
  React.useEffect(() => {
    try {
      window.localStorage.setItem('torisui-preview', JSON.stringify(preferences));
    } catch {
      /* Preferences also work without browser storage. */
    }
  }, [preferences]);
  React.useLayoutEffect(() => {
    const color = brands[preferences.brand];
    const dark = resolvedTheme === 'dark';
    const compact = preferences.corners === 'compact';
    const tokens: Record<string, string> = {
      '--tori-primary': dark ? color.dark : color.light,
      '--tori-primary-strong': dark ? color.darkStrong : color.strong,
      '--tori-primary-fg': dark ? color.darkForeground : '255 255 255',
      '--tori-gradient-fg': dark ? color.darkForeground : '255 255 255',
      '--tori-radius-sm': compact ? '4px' : '8px',
      '--tori-radius-md': compact ? '6px' : '12px',
      '--tori-radius-lg': compact ? '8px' : '16px',
    };
    // Portals mount under body, so root tokens keep dialogs and popovers in sync with previews.
    const rootStyle = document.documentElement.style;
    const previous = Object.keys(tokens).map(
      (name) =>
        [name, rootStyle.getPropertyValue(name), rootStyle.getPropertyPriority(name)] as const,
    );
    Object.entries(tokens).forEach(([name, value]) => rootStyle.setProperty(name, value));
    return () =>
      previous.forEach(([name, value, priority]) => {
        if (value) rootStyle.setProperty(name, value, priority);
        else rootStyle.removeProperty(name);
      });
  }, [preferences.brand, preferences.corners, resolvedTheme]);
  return [preferences, setPreferences] as const;
}

function PreviewControls({
  preferences,
  onChange,
}: {
  preferences: PreviewPreferences;
  onChange: (preferences: PreviewPreferences) => void;
}) {
  return (
    <div className="kit-preview-settings" role="group" aria-label="미리보기 설정">
      <label className="kit-preview-setting">
        <span>브랜드</span>
        <span
          className="kit-brand-swatch"
          style={{ backgroundColor: `rgb(${brands[preferences.brand].light})` }}
          aria-hidden="true"
        />
        <select
          aria-label="미리보기 브랜드 색상"
          value={preferences.brand}
          onChange={(event) =>
            onChange({ ...preferences, brand: event.target.value as PreviewPreferences['brand'] })
          }
        >
          <option value="cobalt">코발트</option>
          <option value="forest">포레스트</option>
          <option value="coral">코랄</option>
        </select>
      </label>
      <label className="kit-preview-setting">
        <span>모서리</span>
        <select
          aria-label="미리보기 모서리"
          value={preferences.corners}
          onChange={(event) =>
            onChange({
              ...preferences,
              corners: event.target.value as PreviewPreferences['corners'],
            })
          }
        >
          <option value="round">라운드</option>
          <option value="compact">컴팩트</option>
        </select>
      </label>
    </div>
  );
}
const categories: { id: Category; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'action', label: '액션' },
  { id: 'form', label: '입력' },
  { id: 'navigation', label: '탐색' },
  { id: 'overlay', label: '오버레이' },
  { id: 'feedback', label: '피드백' },
  { id: 'display', label: '디스플레이' },
];

function matches(demo: Demo, category: Category, query: string) {
  return (
    (category === 'all' || demo.category === category) &&
    `${demo.title} ${demo.name} ${demo.description}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase())
  );
}
function readView(): ViewState {
  const params = new URLSearchParams(window.location.search);
  const category = categories.find((item) => item.id === params.get('category'))?.id ?? 'all';
  const query = (params.get('q') ?? '').slice(0, 160);
  const component =
    demos.find((demo) => demo.id === params.get('component') && matches(demo, category, query))
      ?.id ?? null;
  return { category, query, component };
}
function writeView(view: ViewState, replace = false) {
  const url = new URL(window.location.href);
  if (view.category === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', view.category);
  if (view.query) url.searchParams.set('q', view.query);
  else url.searchParams.delete('q');
  if (view.component) url.searchParams.set('component', view.component);
  else url.searchParams.delete('component');
  if (url.href !== window.location.href)
    window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
}

function Icon({
  name,
  className,
}: {
  name: 'arrow' | 'expand' | 'search' | 'copy' | 'sun' | 'moon' | 'close' | 'reset' | 'check';
  className?: string;
}) {
  const Glyph = {
    arrow: ArrowRight,
    expand: ArrowsOutSimple,
    search: MagnifyingGlass,
    copy: Copy,
    sun: Sun,
    moon: Moon,
    close: X,
    reset: ArrowCounterClockwise,
    check: Check,
  }[name];
  return <Glyph className={className} size={20} weight="regular" aria-hidden="true" />;
}

function CopyControl({
  text,
  label,
  command = false,
}: {
  text: string;
  label: string;
  command?: boolean;
}) {
  const [status, setStatus] = React.useState<'idle' | 'copying' | 'copied' | 'fallback'>('idle');
  const selectionRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (status === 'fallback') {
      selectionRef.current?.focus();
      selectionRef.current?.select();
    }
    if (status === 'copied') {
      const timer = window.setTimeout(() => setStatus('idle'), 2200);
      return () => window.clearTimeout(timer);
    }
  }, [status]);
  React.useEffect(() => setStatus('idle'), [text]);
  async function copy() {
    setStatus('copying');
    try {
      if (!window.isSecureContext || !navigator.clipboard?.writeText)
        throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('fallback');
    }
  }
  return (
    <div className={command ? 'kit-install' : 'kit-copy'}>
      <button
        type="button"
        className={command ? 'kit-install__button' : 'kit-text-button'}
        onClick={copy}
        disabled={status === 'copying'}
        aria-label={status === 'copied' ? `${label} 완료` : label}
      >
        {command ? (
          <>
            <span className="kit-install__prefix" aria-hidden="true">
              $
            </span>
            <code>{text}</code>
          </>
        ) : (
          <span>{status === 'copied' ? '복사 완료' : '코드 복사'}</span>
        )}
        <Icon name={status === 'copied' ? 'check' : 'copy'} />
      </button>
      <span
        className={
          command
            ? 'kit-install__status'
            : status === 'fallback'
              ? 'kit-copy__status'
              : 'kit-sr-only'
        }
        role="status"
        aria-live="polite"
      >
        {status === 'copied'
          ? '클립보드에 복사했어요.'
          : status === 'fallback'
            ? '자동 복사를 사용할 수 없어요. 아래 선택된 텍스트를 직접 복사하세요.'
            : command
              ? '명령어를 클릭하면 복사됩니다.'
              : ''}
      </span>
      {status === 'fallback' && (
        <textarea
          ref={selectionRef}
          className="kit-copy-fallback"
          aria-label={`${label}할 텍스트`}
          readOnly
          value={text}
          rows={command ? 2 : 5}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
    </div>
  );
}

function ThemeControl() {
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === 'dark';
  return (
    <button
      type="button"
      className="kit-theme-button"
      aria-label={dark ? '라이트 모드로 변경' : '다크 모드로 변경'}
      aria-pressed={dark}
      onClick={() => {
        const next = dark ? 'light' : 'dark';
        setTheme(next);
        try {
          window.localStorage.setItem('torisui-theme', next);
        } catch {
          /* Browser storage is optional. */
        }
      }}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
      <span>{dark ? '라이트' : '다크'}</span>
    </button>
  );
}

function Gallery() {
  const [view, setView] = React.useState<ViewState>(readView);
  const [demoVersion, setDemoVersion] = React.useState(0);
  const [resetStatus, setResetStatus] = React.useState('');
  const [preferences, setPreferences] = usePreviewPreferences();
  const filtered = demos.filter((demo) => matches(demo, view.category, view.query));
  const currentIndex = filtered.findIndex((demo) => demo.id === view.component);
  const current = filtered[currentIndex];
  React.useEffect(() => {
    writeView(readView(), true);
    function restore() {
      const next = readView();
      writeView(next, true);
      setView(next);
    }
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  React.useEffect(() => {
    setResetStatus('');
  }, [view.component]);
  function change(next: ViewState, replace = false) {
    writeView(next, replace);
    setView(next);
  }
  function search(query: string) {
    const component =
      demos.find((demo) => demo.id === view.component && matches(demo, view.category, query))?.id ??
      null;
    change({ ...view, query, component }, true);
  }
  function selectComponent(component: string | null) {
    change({ ...view, component });
  }

  return (
    <div className="kit-site">
      <a className="kit-skip" href="#components">
        컴포넌트 목록으로 바로가기
      </a>
      <header className="kit-header kit-container">
        <a className="kit-brand" href="https://toris.kr">
          <span className="kit-brand__mark" aria-hidden="true">
            t.
          </span>
          <span>TORIS STUDIO</span>
        </a>
        <div className="kit-header__right">
          <span className="kit-header__note">작은 디테일, 좋은 인터페이스.</span>
          <a
            className="kit-github"
            href="https://github.com/torisKR/torisui-kit"
            target="_blank"
            rel="noreferrer"
          >
            GitHub<span className="kit-sr-only"> (새 탭)</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <main className="kit-container">
        <section className="kit-intro" aria-labelledby="kit-title">
          <div>
            <p className="kit-eyebrow">
              <span className="kit-eyebrow__dot" aria-hidden="true" /> REACT COMPONENT LIBRARY
            </p>
            <h1 id="kit-title" className="kit-title">
              TorisUI
              <span>
                Kit<span className="kit-title__dot">.</span>
              </span>
            </h1>
          </div>
          <div className="kit-intro__aside">
            <span className="kit-intro__index" aria-hidden="true">
              01 / EXPLORE & INTERACT
            </span>
            <h2>
              보고, 눌러보고.
              <br /> 내 화면에 담아보세요.
            </h2>
            <p>
              버튼부터 다이얼로그까지, {demos.length}개의 React 컴포넌트를
              <br className="kit-desktop-break" /> 직접 사용하며 나에게 맞는 인터페이스를
              찾아보세요.
            </p>
            <CopyControl text={installCommand} label="설치 명령어 복사" command />
            <p className="kit-install-version">
              npm v{packageVersion} · 모든 예시를 설치해서 사용하세요.
            </p>
          </div>
        </section>
        <section className="kit-gallery" aria-labelledby="components">
          <div className="kit-gallery__heading">
            <h2 id="components" tabIndex={-1}>
              컴포넌트 둘러보기 <span>{demos.length}</span>
            </h2>
            <span className="kit-gallery__hint">
              미리보기 안에서 직접 클릭해보세요 <Icon name="arrow" />
            </span>
          </div>
          <div className="kit-toolbar">
            <div className="kit-filters" role="group" aria-label="컴포넌트 분류">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className="kit-filter"
                  aria-pressed={view.category === category.id}
                  onClick={() => change({ ...view, category: category.id, component: null })}
                >
                  {category.label}
                  <span>
                    {category.id === 'all'
                      ? demos.length
                      : demos.filter((demo) => demo.category === category.id).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="kit-toolbar__tools">
              <div className="kit-search">
                <Icon name="search" />
                <input
                  type="search"
                  aria-label="컴포넌트 검색"
                  placeholder="컴포넌트 검색"
                  value={view.query}
                  maxLength={160}
                  onChange={(event) => search(event.target.value)}
                />
                {view.query && (
                  <button type="button" aria-label="검색어 지우기" onClick={() => search('')}>
                    <Icon name="close" />
                  </button>
                )}
              </div>
              <ThemeControl />
            </div>
          </div>
          <div className="kit-results" role="status" aria-live="polite">
            <span>
              {view.query
                ? `“${view.query}” 검색 결과`
                : categories.find((category) => category.id === view.category)?.label}{' '}
              <strong>{filtered.length}</strong>개
            </span>
            <PreviewControls preferences={preferences} onChange={setPreferences} />
          </div>
          {filtered.length ? (
            <div className="kit-grid">
              {filtered.map((demo) => {
                const Preview = demo.component;
                const number = demos.indexOf(demo) + 1;
                return (
                  <article className="kit-tile" key={demo.id}>
                    <div className={`kit-preview kit-preview--${demo.category}`}>
                      <div className="kit-preview__inner">
                        <Preview />
                      </div>
                    </div>
                    <div className="kit-tile__footer">
                      <span className="kit-tile__number">{String(number).padStart(2, '0')}</span>
                      <div className="kit-tile__label">
                        <h3>
                          {demo.title}
                          {demo.release && <span className="kit-next-badge">v{demo.release}</span>}
                        </h3>
                        <span>{demo.name}</span>
                      </div>
                      <button
                        type="button"
                        className="kit-expand"
                        aria-label={`${demo.title} 크게 보기`}
                        onClick={() => selectComponent(demo.id)}
                      >
                        <Icon name="expand" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="kit-empty">
              <Icon name="search" />
              <h3>찾는 컴포넌트가 없어요.</h3>
              <p>다른 검색어를 입력하거나 전체 목록을 확인해보세요.</p>
              <button
                type="button"
                className="kit-primary-button"
                onClick={() => change({ category: 'all', query: '', component: null })}
              >
                전체 컴포넌트 보기 <Icon name="arrow" />
              </button>
            </div>
          )}
        </section>
      </main>
      <footer className="kit-footer kit-container">
        <a href="https://toris.kr">
          TORIS STUDIO <span aria-hidden="true">↗</span>
        </a>
        <p>취향을 담은 컴포넌트. TorisUI Kit.</p>
        <a
          href="https://github.com/torisKR/torisui-kit/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          MIT License<span className="kit-sr-only"> (새 탭)</span>
        </a>
      </footer>
      <Dialog
        open={Boolean(current)}
        onOpenChange={(open) => {
          if (!open) selectComponent(null);
        }}
        title={
          current && (
            <>
              <span className="kit-detail__name">{current.name}</span>
              {current.title}
            </>
          )
        }
        description={current?.description}
        showClose={false}
        size="lg"
        className="kit-detail"
      >
        {current &&
          (() => {
            const Preview = current.component;
            return (
              <>
                <button
                  type="button"
                  className="kit-detail__close kit-expand"
                  aria-label="컴포넌트 상세 닫기"
                  data-autofocus
                  onClick={() => selectComponent(null)}
                >
                  <Icon name="close" />
                </button>
                <div className="kit-detail__preview-toolbar">
                  <span>미리보기 너비</span>
                  <div className="kit-width-controls" role="group" aria-label="상세 미리보기 너비">
                    <button
                      type="button"
                      aria-pressed={preferences.viewport === 'fluid'}
                      onClick={() => setPreferences({ ...preferences, viewport: 'fluid' })}
                    >
                      가용 너비
                    </button>
                    <button
                      type="button"
                      aria-pressed={preferences.viewport === 'mobile'}
                      onClick={() => setPreferences({ ...preferences, viewport: 'mobile' })}
                    >
                      320px
                    </button>
                  </div>
                </div>
                <div
                  className={`kit-preview kit-preview--${current.category} kit-detail__preview`}
                  data-preview-width={preferences.viewport}
                >
                  <div className="kit-preview__inner">
                    <Preview key={`${current.id}-${demoVersion}`} />
                  </div>
                </div>
                <div className="kit-detail__tools">
                  <span>직접 눌러 동작을 확인하세요.</span>
                  <button
                    type="button"
                    className="kit-text-button"
                    onClick={() => {
                      setDemoVersion((version) => version + 1);
                      setResetStatus('미리보기를 초기화했어요.');
                    }}
                  >
                    <Icon name="reset" />
                    초기화
                  </button>
                </div>
                <p className="kit-detail__reset-status" role="status" aria-live="polite">
                  {resetStatus}
                </p>
                <p className="kit-code__setup">
                  공통 설정: <code>import '@toris-dev/ui/styles.css'</code>를 한 번 추가하고, 앱
                  루트를 <code>{'<ToriProvider>…</ToriProvider>'}</code>로 감싸주세요.
                </p>
                {current.release && (
                  <p className="kit-next-note">
                    <span>npm v{current.release}</span>이 컴포넌트는 npm v{current.release}부터
                    포함되어 있습니다. 위 설치 명령어로 설치한 뒤 아래 예시를 바로 사용하세요.
                  </p>
                )}
                <div className="kit-code">
                  <div className="kit-code__heading">
                    <span>
                      사용 예시 <span>TSX</span>
                    </span>
                    <CopyControl text={current.code} label={`${current.title} 코드 복사`} />
                  </div>
                  <pre tabIndex={0} aria-label={`${current.title} 사용 예시 코드`}>
                    <code>{current.code}</code>
                  </pre>
                </div>
                <nav className="kit-detail__navigation" aria-label="컴포넌트 상세 탐색">
                  <button
                    type="button"
                    className="kit-text-button"
                    disabled={currentIndex === 0}
                    onClick={() => {
                      const previous = filtered[currentIndex - 1];
                      if (previous) selectComponent(previous.id);
                    }}
                  >
                    <Icon name="arrow" className="kit-arrow-back" />
                    이전
                  </button>
                  <span>
                    {currentIndex + 1} / {filtered.length}
                  </span>
                  <button
                    type="button"
                    className="kit-text-button"
                    disabled={currentIndex === filtered.length - 1}
                    onClick={() => {
                      const next = filtered[currentIndex + 1];
                      if (next) selectComponent(next.id);
                    }}
                  >
                    다음
                    <Icon name="arrow" />
                  </button>
                </nav>
              </>
            );
          })()}
      </Dialog>
    </div>
  );
}

export function App() {
  const [initialTheme] = React.useState<'light' | 'dark'>(() => {
    try {
      return window.localStorage.getItem('torisui-theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });
  return (
    <ToriProvider theme={initialTheme}>
      <Gallery />
    </ToriProvider>
  );
}
