## Directory layout

```
virta-tech-support-portfolio/
  project-docs/          ← LOCAL ONLY — gitignored. CV, job notes, superpowers plans.
  01-knowledge-base/     ← committed portfolio project
    docs/                ← committed (MkDocs source)
    mkdocs.yml
  02-sql-analysis/       ← committed portfolio project (future)
  03-ticket-tracker/     ← committed portfolio project (future)
  ...
```

## Rules

- `project-docs/` is the local-only folder — never commit or push anything inside it
- When a prompt says "save to docs/" or "keep in docs/", interpret that as `project-docs/`
- Portfolio project files (articles, code, configs) go in their numbered subdirectory at the repo root and ARE committed
- Subdirectory `docs/` folders inside projects (e.g. `01-knowledge-base/docs/`) are MkDocs source dirs and ARE committed — do not confuse with `project-docs/`
- Never modify `.gitignore` to unblock a commit — ask first
