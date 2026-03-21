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

---

## Users

| User | Description |
|------|-------------|
| Support Specialist | Creates tickets, updates status, adds notes and replies, escalates issues |

Single user type — no login, no roles. This is a portfolio demo, not a production multi-tenant system.

---

## Features

### 1. Ticket Management

| Field | Type | Values |
|-------|------|--------|
| Title | Text | Free text, required |
| Status | Enum | `open` · `in-progress` · `escalated` · `resolved` |
| Priority | Enum | `low` · `medium` · `high` |
| Category | Enum | `billing` · `technical` · `device` · `account` |
| Customer Type | Enum | `B2B` · `B2C` |
| Created At | Timestamp | Auto-set on creation |
| Updated At | Timestamp | Auto-updated on every change |

**Ticket lifecycle:**
```
open → in-progress → escalated → resolved
         ↑_____________________________|  (can re-open resolved)
```

### 2. Escalation

When a ticket is set to `escalated`:
- A **reason field** is required and stored
- An **escalated_at timestamp** is recorded — only on the first transition to `escalated`, not reset by subsequent patches

### 3. Filtering

The ticket list can be filtered by any combination of:
- Status
- Priority
- Category
- Customer type (B2B / B2C)

Filters are applied client-side via API query parameters. Multiple filters can be active simultaneously.

### 4. Notes and Replies

Each ticket can have an ordered list of notes. Two types:

| Type | Visibility | Use case |
|------|-----------|----------|
| `internal` | Team only | Diagnosis notes, L2 context, investigation findings |
| `reply` | Customer-facing | Responses sent to the customer |

Notes are append-only, ordered by creation time, and displayed with visual distinction (colour-coded).

---

## Technical Requirements

| Concern | Decision |
|---------|----------|
| Backend | Node.js + Express |
| Database | SQLite via `better-sqlite3` |
| Frontend | Plain HTML / CSS / Vanilla JS — no build step |
| API style | REST JSON |
| Tests | Jest + supertest (API layer only) |
| Node version | 18+ |
| Port | 3000 |

---

## API Surface

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tickets` | List tickets; supports `?status=`, `?priority=`, `?category=`, `?customer_type=` |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets/:id` | Get one ticket with all its notes |
| PATCH | `/api/tickets/:id` | Update status, priority, or escalation fields |
| POST | `/api/tickets/:id/notes` | Add an internal note or customer reply |

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

- [ ] A new ticket can be created with all required fields via a modal form
- [ ] The ticket list updates immediately after creation
- [ ] Tickets can be filtered by status, priority, category, and customer type — in any combination
- [ ] Clicking a ticket shows its full detail in the right panel
- [ ] Ticket status can be changed and saved; the list reflects the change
- [ ] Setting status to `escalated` reveals the escalation reason field
- [ ] `escalated_at` is only set once — on the first transition to `escalated`
- [ ] An internal note and a customer reply can both be added to a ticket
- [ ] Internal notes display with a yellow left border; customer replies with green
- [ ] All API routes have passing Jest tests
- [ ] `npm start` boots the server; `npm test` runs all tests

---

## Setup

```bash
cd 03-ticket-tracker
npm install
npm start
# → http://localhost:3000
```

```bash
npm test
```
