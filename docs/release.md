# Releases & npm Publishing

npm package: **`@toris-dev/ui`** (scoped, public). Publishing is triggered only by
publishing a GitHub Release.

## Release flow

```txt
1. Develop on codex/* branches; include a changeset in the PR
2. CI passes → merge to main
3. pnpm changeset version   # bump versions + generate CHANGELOG, commit
4. git tag v0.x.y && publish a GitHub Release
5. publish.yml runs automatically → re-verifies gates → npm publish (Trusted Publishing)
6. Confirm the new version on npm
7. Install the registry tarball in the standalone example verifier
8. Deploy the gallery after its examples and install command match the public version
```

The workflow asserts the release tag equals `v<package version>` — a mismatched
tag fails the run instead of silently publishing the wrong version.

## 1. Trusted Publishing setup (default, one-time)

Publishes via GitHub Actions OIDC — no long-lived npm token.

### Prerequisites

The very first publish may need to be manual:

```bash
cd packages/ui
npm login
pnpm build
npm publish --access public
```

### On npmjs.com

`@toris-dev/ui` package → Settings → **Trusted Publisher**:

| Field             | Value                                                                              |
| ----------------- | ---------------------------------------------------------------------------------- |
| Publisher         | GitHub Actions                                                                     |
| Organization/User | The GitHub **repository owner** (may differ from the npm account name — watch out) |
| Repository        | `torisui-kit`                                                                      |
| Workflow filename | `publish.yml`                                                                      |
| Environment       | `npm`                                                                              |

This repository is `torisKR/torisui-kit`: use `torisKR` as Organization/User.
The package manifest's repository URL must match this repository.

### On the GitHub repository

- Settings → Environments → create the `npm` environment (must match
  `environment: npm` in both publish workflows), then add **required reviewers**
  and **deployment branch/tag rules**. An environment that is merely referenced
  but never configured provides zero protection.
- `permissions: id-token: write` is already set in the workflow
- Trusted Publishing requires npm CLI ≥ 11.5.1 → satisfied by Node 24 in the workflow

## 2. Token fallback (publish-token.yml)

If Trusted Publishing isn't configured yet or OIDC isn't possible:

1. npmjs.com → Access Tokens → issue a **Granular** token (packages: `@toris-dev/ui`, read-write)
2. GitHub repo Settings → Secrets → add `NPM_TOKEN`
3. Actions tab → "Publish Package With Token" → **Run workflow** (manual trigger only)

> The fallback runs behind the same `npm` environment gate, only from `main`,
> and never on release events — a low-blast-radius escape hatch.

## 3. Pre-release checklist

- [ ] `pnpm verify` passes (lint/typecheck/test/build)
- [ ] `cd packages/ui && npm pack --dry-run` — only dist/README/LICENSE included
- [ ] `pnpm changeset version` has run (version bump + CHANGELOG)
- [ ] README up to date
- [ ] `pnpm verify:package-examples /path/to/package.tgz` passes all gallery and complete README examples in a separate consumer project
- [ ] Package name `@toris-dev/ui`, `publishConfig.access: public` confirmed
- [ ] Release tag equals `v<package version>`
- [ ] GitHub Release notes written (from the Changesets CHANGELOG)

## 4. Version rules (Changesets)

| Change                                      | semver |
| ------------------------------------------- | ------ |
| Breaking prop/behavior change, token rename | major  |
| New component, new prop, new token          | minor  |
| Bug fix, style tweak, docs                  | patch  |

During 0.x, breaking changes ship as minor (npm semver convention).

## Published-package example verification

The CI and both publishing workflows pack the built library and run
`scripts/verify-package-examples.mjs` before publication. The verifier installs
the artifact in an isolated consumer, checks all 47 gallery TSX examples and
complete README TSX examples against the packaged declarations, and checks the
new components in ESM/CJS and the packaged CSS.

After publication, repeat the same verification with the registry artifact:

```sh
npm pack @toris-dev/ui@0.6.0 --pack-destination /tmp
pnpm verify:package-examples /tmp/toris-dev-ui-0.6.0.tgz
```

The consumer project is preserved for browser verification by default. Its
`index.html` and `main.tsx` mount the selected copied example with the installed
`ToriProvider` and package stylesheet. Use `--clean` for CI, and `--offline` only
when the required dependencies are already in the npm cache.

## 5. Incident response

- Wrong version published: `npm deprecate @toris-dev/ui@x.y.z "use x.y.z+1"` and
  ship a patch (unpublish is 72-hour limited and discouraged)
- publish.yml failure: check the Actions log — gate failures mean fix code and
  re-publish the Release; OIDC failures mean re-check the Trusted Publisher
  fields (owner/repo/workflow filename/environment)

## 6. Automated release drafts (prepare-release.yml)

Tags and releases are not created by hand:

```txt
pnpm changeset version → push to main (packages/ui/package.json changes)
  → prepare-release.yml drafts release "v<version>" with auto-generated notes
  → you review the draft and click Publish
  → publishing creates the tag and fires publish.yml (Trusted Publishing)
  → you approve the npm environment → npm publish
```

- Notes are categorized by `.github/release.yml` (label PRs with
  `feature` / `fix` / `docs`; everything else lands in Maintenance).
- The workflow is idempotent — it skips when the tag or release already exists.
- Two human checkpoints remain by design: publishing the draft release and
  approving the `npm` environment deployment.
