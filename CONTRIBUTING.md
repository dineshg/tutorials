# Contributing

This repository is being converted from a static tutorial collection into a maintainable technical book: *From Data Scientist to Production AI Lead*.

## Local Setup

Clone the repository and serve the current static site:

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080/
```

There is no Python package, Quarto project, or example test suite yet. The migration plan recommends adding those in later implementation passes.

## Build the Book

Current build model:

- No local build command
- GitHub Pages deploys the repository root as static files through `.github/workflows/pages.yml`

Planned build model:

```bash
quarto render book --to html
```

The Quarto migration is documented in [BOOK_RESTRUCTURE_PLAN.md](BOOK_RESTRUCTURE_PLAN.md).

## Add or Edit a Chapter

1. Follow [STYLE_GUIDE.md](STYLE_GUIDE.md).
2. Use the standard chapter template.
3. Define acronyms on first use.
4. Include practical industry examples.
5. Connect abstract topics to the enterprise document Q&A assistant when useful.
6. Add a visual explanation where it improves understanding.
7. Keep code examples small, runnable, and safe.
8. Run the asset checker before submitting.

## Add Code Examples

Example code should:

- use synthetic data unless a public dataset is clearly referenced and licensed
- avoid private credentials
- read optional API keys from environment variables
- include type hints where useful
- include minimal tests where practical
- include setup and run instructions

For FastAPI examples, include:

- request and response schemas
- health endpoint
- error handling
- curl examples
- tests using `TestClient`

## Add Images or Generated Assets

1. Do not use remote images for core instructional content.
2. Store local assets under `assets/`.
3. Use Mermaid for flow and architecture diagrams when possible.
4. Use generated SVG or PNG for plots and ML demonstrations.
5. Add alt text to every image reference.
6. Use lowercase kebab-case filenames.
7. Document generation steps or source.
8. Run:

```bash
python3 scripts/check_assets.py
```

## Regenerate Generated Assets

A consolidated generation script does not exist yet. The planned script is:

```text
scripts/generate_assets.py
```

Until then, generated assets should include clear source notes in the relevant chapter or in `ASSET_MANIFEST.md`.

## Run Asset Checks

```bash
python3 scripts/check_assets.py
```

The checker:

- scans documentation files
- detects local image and media references
- verifies referenced local files exist
- warns on remote media URLs
- exits non-zero when required local assets are missing

Current audit status is documented in [ASSET_MANIFEST.md](ASSET_MANIFEST.md).

## Run Tests

There is no repository-wide test suite yet. Once examples are added, the expected command is:

```bash
python3 -m pytest
```

Tests should not require private credentials or paid external APIs.

## Check Links

Run the internal link checker:

```text
python3 scripts/check_links.py
```

External link checks should be soft-fail in CI because third-party websites can be flaky. Broken local image references should be strict failures.

## Pull Request Checklist

- [ ] Book builds locally, or static site serves locally in the current phase
- [ ] No broken image references
- [ ] No broken internal links introduced
- [ ] New images are local
- [ ] New images have alt text
- [ ] Generated images have source scripts or documentation
- [ ] Code examples run or are clearly marked conceptual
- [ ] Tests pass where tests exist
- [ ] No secrets committed
- [ ] Acronyms are defined
- [ ] Chapter follows the standard template

## Writing Quality Checklist

- [ ] The chapter has a clear audience and purpose
- [ ] The explanation is practical and industry-aware
- [ ] The chapter avoids unexplained acronyms
- [ ] The chapter includes examples
- [ ] The chapter includes common mistakes
- [ ] The chapter includes production considerations
- [ ] The chapter includes exercises
- [ ] Further reading uses authoritative sources

## Technical Review Checklist

- [ ] Code examples are safe to run locally
- [ ] External APIs are mocked or optional
- [ ] No credentials are hard-coded
- [ ] Security claims are precise
- [ ] Fast-changing tools have version notes
- [ ] Examples include validation and error handling where relevant

## Asset Quality Checklist

- [ ] All local image references point to existing files
- [ ] Core instructional images are local or Mermaid
- [ ] Broken remote images are replaced
- [ ] Generated plots live under `assets/generated/` or `assets/plots/`
- [ ] Generated plots have source scripts or notes
- [ ] Image filenames are descriptive
- [ ] Image filenames use lowercase kebab-case
- [ ] Third-party images have compatible licensing or are replaced
