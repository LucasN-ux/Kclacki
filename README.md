# Klacki

The keyboard shortcuts of creative software (3D, texturing, VFX, video, 2D), in one place.
Windows and Mac, checked against each publisher's own documentation.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Commands

| Command              | What it does                                |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Starts the site locally                     |
| `npm run build`      | Builds the site as in production            |
| `npm run check`      | Lint, types, formatting and tests in one go |
| `npm run test:watch` | Runs the tests again on every save          |
| `npm run format`     | Fixes the formatting                        |

## How it works

- **No backend, no database, no account.** Pages are generated ahead of time; the
  search, the Windows/Mac toggle and the favorites run in the visitor's browser.
- **One JSON file per software** in `src/data/software`, checked by a Zod schema
  when the site is built: a wrong or incomplete file stops the build.
- **Two languages**, English at `/en` and French at `/fr`, from `src/i18n`.

## Adding a software

1. Write `src/data/software/<id>.json` following the schema in `src/domain/schema.ts`.
2. Add one line to `src/data/index.ts`.
3. Run `npm run check`.

Shortcuts come from each publisher's official documentation: only the keys are
reused, every description is written for this site. Sources are listed on the
site's own Sources page.
