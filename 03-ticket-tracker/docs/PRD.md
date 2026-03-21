# Product Requirements Document — Support Ticket Tracker

**Project:** 03 — Support Ticket Tracker
**Portfolio:** Virta Technical Support Specialist
**Status:** Ready for implementation

---

## Overview

A lightweight web app that models the core of a Zendesk-style support queue for an EV charging support team. The goal is to demonstrate understanding of CRM workflows, ticket lifecycle management, and the distinction between internal team communication and customer-facing replies.

---

## Problem Statement

Support teams at EV charging companies handle a mix of billing disputes, technical faults, device issues, and account problems across both B2B fleet customers and B2C individual users. Without a structured queue, tickets get lost, escalations lack context, and customer follow-up falls through the cracks. This project simulates the tooling a support specialist uses daily.

---

## Goals

- Demonstrate familiarity with support queue logic (status transitions, priority, escalation)
- Show understanding of the B2B/B2C distinction in customer support
- Illustrate the difference between internal team notes and customer-facing replies
- Produce a working, runnable app — not a mockup

---

## Non-Goals

- Real authentication or user accounts
- Email or notification delivery
- SLA timers or dashboards
- Multi-agent assignment
- Mobile-optimised layout
- Backend server or database (all data persisted client-side)

---

## Users

| User               | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| Support Specialist | Creates tickets, updates status, adds notes and replies, escalates issues |

Single user type — no login, no roles. This is a portfolio demo, not a production multi-tenant system.

---

## Features

### 1. Ticket Management

| Field         | Type      | Values                                            |
| ------------- | --------- | ------------------------------------------------- |
| Title         | Text      | Free text, required                               |
| Status        | Enum      | `open` · `in-progress` · `escalated` · `resolved` |
| Priority      | Enum      | `low` · `medium` · `high`                         |
| Category      | Enum      | `billing` · `technical` · `device` · `account`    |
| Customer Type | Enum      | `B2B` · `B2C`                                     |
| Created At    | Timestamp | Auto-set on creation                              |
| Updated At    | Timestamp | Auto-updated on every change                      |

**Ticket lifecycle:**

```
open → in-progress → escalated → resolved
         ↑_____________________________|  (can re-open resolved)
```

### 2. Escalation

When a ticket is set to `escalated`:

- A **reason field** is required and stored
- An **escalated_at timestamp** is recorded — only on the first transition to `escalated`, not reset by subsequent updates

### 3. Filtering

The ticket list can be filtered by any combination of:

- Status
- Priority
- Category
- Customer type (B2B / B2C)

Filters are applied client-side in React state. Multiple filters can be active simultaneously.

### 4. Notes and Replies

Each ticket can have an ordered list of notes. Two types:

| Type       | Visibility      | Use case                                            |
| ---------- | --------------- | --------------------------------------------------- |
| `internal` | Team only       | Diagnosis notes, L2 context, investigation findings |
| `reply`    | Customer-facing | Responses sent to the customer                      |

Notes are append-only, ordered by creation time, and displayed with visual distinction (colour-coded via Shadcn Badge + border styling).

---

## Technical Requirements

| Concern      | Decision                                                      |
| ------------ | ------------------------------------------------------------- |
| Frontend     | React 19 + Vite                                               |
| UI Components| Shadcn UI (Radix primitives + Tailwind CSS v4)                |
| Data Storage | localStorage (client-side only, no backend)                   |
| State        | React component state + a thin `storage.js` service layer     |
| Build        | `npm run build` → `dist/` (static files)                      |
| Node version | 18+                                                           |
| Dev port     | 5173 (Vite default)                                           |
| Future deploy| Vercel (planned — `dist/` is drop-in compatible)              |

---

## Data Storage

All data is persisted in localStorage under two keys:

- `tt_tickets` — JSON array of ticket objects
- `tt_notes` — JSON array of note objects (linked by `ticket_id`)

All reads and writes go through `src/storage.js` — no component accesses localStorage directly.

---

## File Map

```
03-ticket-tracker/
  package.json
  vite.config.js
  index.html
  tailwind.config.js
  postcss.config.js
  components.json           ← Shadcn config
  src/
    main.jsx                ← React entry point
    App.jsx                 ← layout shell, selected ticket state
    storage.js              ← ONLY file that reads/writes localStorage
    lib/
      utils.js              ← cn() helper (Shadcn standard)
    components/
      ui/                   ← Shadcn auto-generated components
      TicketList.jsx        ← left panel: filter bar + ticket cards
      TicketDetail.jsx      ← right panel: fields, status, notes thread
      NewTicketModal.jsx    ← Dialog form for creating a ticket
      FilterBar.jsx         ← status/priority/category/customer type selects
      NoteItem.jsx          ← single note row, colour-coded by type
  README.md
```

---

## UI Layout

Two-column single-page layout:

```
┌─────────────────────────────────────────────────────┐
│  EV Support Ticket Tracker              [+ New Ticket]│
├──────────────────────┬──────────────────────────────┤
│  Filters             │  Ticket Title                 │
│  ─────────────────   │  [open] [high] [B2C]          │
│  Status ▾            │                               │
│  Priority ▾          │  Status: [in-progress ▾] Save │
│  Category ▾          │                               │
│  Customer type ▾     │  Notes & Replies              │
│                      │  ┌─────────────────────────┐  │
│  ─────────────────   │  │ Internal note · 10:32   │  │
│  [Ticket 1]          │  └─────────────────────────┘  │
│  [open][high][B2C]   │  ┌─────────────────────────┐  │
│                      │  │ Customer reply · 10:45  │  │
│  [Ticket 2]          │  └─────────────────────────┘  │
│  [escalated][B2B]    │                               │
│                      │  [Internal note ▾]            │
│                      │  [textarea              ]     │
│                      │  [Add]                        │
└──────────────────────┴──────────────────────────────┘
```

---

## Acceptance Criteria

- [ ] A new ticket can be created with all required fields via a modal form (Shadcn Dialog)
- [ ] The ticket list updates immediately after creation
- [ ] Tickets can be filtered by status, priority, category, and customer type — in any combination
- [ ] Clicking a ticket shows its full detail in the right panel
- [ ] Ticket status can be changed and saved; the list reflects the change
- [ ] Setting status to `escalated` reveals the escalation reason field
- [ ] `escalated_at` is only set once — on the first transition to `escalated`
- [ ] An internal note and a customer reply can both be added to a ticket
- [ ] Internal notes display with a yellow left border; customer replies with green
- [ ] All data persists across page refreshes (localStorage)
- [ ] `npm run dev` starts the Vite dev server; `npm run build` produces a deployable `dist/`

---

## Setup

```bash
cd 03-ticket-tracker
npm install
npm run dev
# → http://localhost:5173
```

```bash
npm run build
# → dist/ folder ready for Vercel or any static host
```
