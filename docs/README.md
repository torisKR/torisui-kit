# TorisUI Kit 문서

`@toris-dev/ui` **0.6.0**의 설치, 컴포넌트 사용, 테마, 개발과 배포 절차를 안내합니다. [47종 컴포넌트 갤러리](https://toris.kr/torisui-kit/)에서 실제 동작과 코드를 함께 확인하세요.

| 문서                                       | 내용                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| [패키지 README](../packages/ui/README.md)  | npm 설치, Provider·스타일 설정, 0.6.0의 신규 10종 API, 숫자·태그·확인 모달 예시 |
| [getting-started.md](./getting-started.md) | 로컬 개발 환경, 명령어, 플레이그라운드                                          |
| [architecture.md](./architecture.md)       | 모노레포 구조, 레이어 구성, 패키지 설계                                         |
| [theming.md](./theming.md)                 | 디자인 토큰, 다크 모드, 브랜드 설정                                             |
| [components.md](./components.md)           | 컴포넌트 API와 사용 예시                                                        |
| [showcase.md](./showcase.md)               | 갤러리 실행, 테마·브랜드·너비 설정, 사이트 내보내기, 컴포넌트 스키마            |
| [harness.md](./harness.md)                 | 검증 단계, CI, 테스트 전략, 컴포넌트 품질 기준                                  |
| [release.md](./release.md)                 | Changesets 버전 관리, GitHub Release와 npm 배포                                 |

앱에 사용하려면 패키지 README부터 읽으세요. 저장소 개발은 getting-started → architecture → harness 순서로 확인하면 됩니다.

## 0.6.0 추가 범위

NumberInput · SegmentedControl · Stepper · TagInput · Meter · SearchInput · CopyButton · Chip · Timeline/TimelineItem · AlertDialog를 패키지 루트에서 import할 수 있습니다. 스타일은 `@toris-dev/ui/styles.css`에 함께 포함됩니다.

갤러리는 기존 37종과 신규 10종을 같은 목록에서 제공합니다. 분류와 컴포넌트 선택은 URL에 반영되며, 큰 미리보기에서 320px 너비와 사용 코드를 확인할 수 있습니다.
