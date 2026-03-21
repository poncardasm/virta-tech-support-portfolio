## Directory layout

```
virta-support-portfolio/
  ├── project-docs/          ← LOCAL ONLY — gitignored. CV, job notes, superpowers plans.
  ├── README.md
  ├── 01-knowledge-base/
  │   └── README.md
  ├── 02-sql-analysis/
  │   └── README.md
  ├── 03-ticket-tracker/
  │   └── README.md
  ├── 04-report-generator/
  │   └── README.md
  └── 05-ocpp-client/
      └── README.md
```

## Rules

- `project-docs/` is the local-only folder — never commit or push anything inside it
- When a prompt says "save to docs/" or "keep in docs/", interpret that as `project-docs/`
- Portfolio project files (articles, code, configs) go in their numbered subdirectory at the repo root and ARE committed
- Subdirectory `docs/` folders inside projects (e.g. `01-knowledge-base/docs/`) are MkDocs source dirs and ARE committed — do not confuse with `project-docs/`
- Never modify `.gitignore` to unblock a commit — ask first
- Default branch is `main`
