# Support Ticket Tracker

A lightweight Zendesk-style support ticket tracker for an EV charging support team. Built with React 19, Vite, and Shadcn UI. All data persists in the browser via localStorage — no backend required.

## Stack

- React 19 + Vite
- Shadcn UI (Radix UI + Tailwind CSS v4)
- localStorage (client-side persistence)

## Setup

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Build

```bash
npm run build
# → dist/ folder ready for Vercel or any static host
```

## Features

- Create tickets with title, priority, category, and customer type (B2B/B2C)
- Ticket lifecycle: open → in-progress → escalated → resolved (re-openable)
- Escalation requires a reason; `escalated_at` is set only on first escalation
- Filter tickets by status, priority, category, and customer type (combinable)
- Add internal notes (yellow border) and customer replies (green border)
- All data persists across page refreshes via localStorage

## Future

Planned: deploy to Vercel for a live URL.
