# Support Ticket Tracker — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight Zendesk-style support ticket tracker web app for an EV charging support team, demonstrating CRM workflow understanding for the Virta Technical Support Specialist role.

**Architecture:** React 19 + Vite frontend with Shadcn UI components. All data persisted in localStorage via a thin `storage.js` service layer. No backend, no server — fully static, deployable to Vercel.

**Tech Stack:** React 19, Vite, Shadcn UI, Tailwind CSS v4, localStorage.

**Future deployment:** Vercel — `npm run build` produces a `dist/` folder that is drop-in compatible.

---

## File Map

```
03-ticket-tracker/
  package.json
  vite.config.js
  index.html
  components.json             ← Shadcn config
  src/
    main.jsx                  ← React entry point
    App.jsx                   ← layout shell, selected ticket state
    storage.js                ← ONLY file that reads/writes localStorage
    lib/
      utils.js                ← cn() helper (Shadcn standard)
    components/
      ui/                     ← Shadcn auto-generated components
      TicketList.jsx          ← left panel: filter bar + ticket cards
      TicketDetail.jsx        ← right panel: fields, status, notes thread
      NewTicketModal.jsx      ← Dialog form for creating a ticket
      FilterBar.jsx           ← status/priority/category/customer type selects
      NoteItem.jsx            ← single note row, colour-coded by type
  README.md
```

---

## Task 1: Project Bootstrap

**Files:**

- Create: `03-ticket-tracker/package.json`
- Create: `03-ticket-tracker/vite.config.js`
- Create: `03-ticket-tracker/index.html`
- Create: `03-ticket-tracker/.gitignore`

> **Note:** Tailwind CSS v4 uses a Vite plugin instead of PostCSS — no `tailwind.config.js` or `postcss.config.js` needed.

- [ ] **Step 1: Write package.json**

```json
{
  "name": "ticket-tracker",
  "version": "1.0.0",
  "description": "Zendesk-style support ticket tracker for EV charging support",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.469.0",
    "tailwind-merge": "^2.6.0",
    "tw-animate-css": "^1.0.0",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.7"
  }
}
```

- [ ] **Step 2: Write vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Write index.html**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EV Support Ticket Tracker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write .gitignore**

```
node_modules/
dist/
.env
```

- [ ] **Step 5: Write components.json (Shadcn config)**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": false,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 8: Install dependencies**

```bash
cd 03-ticket-tracker
npm install
```

- [ ] **Step 9: Commit**

```bash
git add 03-ticket-tracker/package.json 03-ticket-tracker/vite.config.js 03-ticket-tracker/index.html 03-ticket-tracker/.gitignore 03-ticket-tracker/components.json
git commit -m "feat(tracker): bootstrap Vite + React 19 + Shadcn + Tailwind v4 project"
```

---

## Task 2: Tailwind CSS + Shadcn Base Styles

**Files:**

- Create: `03-ticket-tracker/src/index.css`
- Create: `03-ticket-tracker/src/lib/utils.js`

> **Note:** Tailwind v4 uses `@import "tailwindcss"` instead of the three `@tailwind` directives. CSS variables use `oklch()` colors and are declared with `@theme inline`. No `tailwind.config.js` required.

- [ ] **Step 1: Write src/index.css**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: Write src/lib/utils.js**

```js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Commit**

```bash
git add 03-ticket-tracker/src/
git commit -m "feat(tracker): add Tailwind base styles and Shadcn cn utility"
```

---

## Task 3: Shadcn UI Components

Add the Shadcn components needed by the app. These are copied/generated into `src/components/ui/`.

Components needed: `Button`, `Badge`, `Card`, `Dialog`, `Input`, `Label`, `Select`, `Separator`, `Textarea`.

- [ ] **Step 1: Add Shadcn components**

Run for each component (or manually copy from shadcn registry):

```bash
npx shadcn@latest add button badge card dialog input label select separator textarea
```

- [ ] **Step 2: Verify files created in src/components/ui/**

Expected: `button.jsx`, `badge.jsx`, `card.jsx`, `dialog.jsx`, `input.jsx`, `label.jsx`, `select.jsx`, `separator.jsx`, `textarea.jsx`

- [ ] **Step 3: Commit**

```bash
git add 03-ticket-tracker/src/components/ui/
git commit -m "feat(tracker): add Shadcn UI base components"
```

---

## Task 4: Storage Service Layer

**Files:**

- Create: `03-ticket-tracker/src/storage.js`

This is the ONLY file that reads or writes localStorage. All components call these functions.

- [ ] **Step 1: Write src/storage.js**

```js
const TICKETS_KEY = 'tt_tickets';
const NOTES_KEY = 'tt_notes';

function loadTickets() {
  return JSON.parse(localStorage.getItem(TICKETS_KEY) || '[]');
}

function saveTickets(tickets) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

function loadNotes() {
  return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getTickets() {
  return loadTickets();
}

export function getTicket(id) {
  const tickets = loadTickets();
  const notes = loadNotes();
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return null;
  return { ...ticket, notes: notes.filter((n) => n.ticket_id === id) };
}

export function createTicket({ title, priority, category, customer_type }) {
  const tickets = loadTickets();
  const ticket = {
    id: crypto.randomUUID(),
    title,
    status: 'open',
    priority,
    category,
    customer_type,
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tickets.unshift(ticket);
  saveTickets(tickets);
  return ticket;
}

export function updateTicket(id, patch) {
  const tickets = loadTickets();
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const existing = tickets[idx];
  const updated = {
    ...existing,
    ...patch,
    updated_at: new Date().toISOString(),
  };

  // escalated_at is set only on first transition to escalated
  if (patch.status === 'escalated' && !existing.escalated_at) {
    updated.escalated_at = new Date().toISOString();
  } else if (patch.status === 'escalated' && existing.escalated_at) {
    updated.escalated_at = existing.escalated_at;
  }

  tickets[idx] = updated;
  saveTickets(tickets);
  return updated;
}

export function addNote(ticket_id, { type, body }) {
  const notes = loadNotes();
  const note = {
    id: crypto.randomUUID(),
    ticket_id,
    type,
    body,
    created_at: new Date().toISOString(),
  };
  notes.push(note);
  saveNotes(notes);
  return note;
}
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/src/storage.js
git commit -m "feat(tracker): add localStorage service layer"
```

---

## Task 5: React Entry Point and App Shell

**Files:**

- Create: `03-ticket-tracker/src/main.jsx`
- Create: `03-ticket-tracker/src/App.jsx`

- [ ] **Step 1: Write src/main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 2: Write src/App.jsx**

App manages:

- `tickets` — full list loaded from storage
- `selectedId` — which ticket is open in the right panel
- `filters` — active filter state (status, priority, category, customer_type)
- `showNewModal` — controls Dialog visibility

```jsx
import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, addNote } from './storage';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import NewTicketModal from './components/NewTicketModal';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({});
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const selectedTicket = tickets.find((t) => t.id === selectedId) || null;

  function handleCreate(fields) {
    const ticket = createTicket(fields);
    setTickets(getTickets());
    setSelectedId(ticket.id);
    setShowNewModal(false);
  }

  function handleUpdate(id, patch) {
    updateTicket(id, patch);
    setTickets(getTickets());
  }

  function handleAddNote(ticket_id, note) {
    addNote(ticket_id, note);
    setTickets(getTickets());
  }

  const filtered = tickets.filter((t) => {
    return (
      (!filters.status || t.status === filters.status) &&
      (!filters.priority || t.priority === filters.priority) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.customer_type || t.customer_type === filters.customer_type)
    );
  });

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-3 border-b">
        <h1 className="text-lg font-semibold">EV Support Ticket Tracker</h1>
        <Button onClick={() => setShowNewModal(true)}>+ New Ticket</Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r flex flex-col overflow-hidden">
          <TicketList
            tickets={filtered}
            selectedId={selectedId}
            filters={filters}
            onFilterChange={setFilters}
            onSelect={setSelectedId}
          />
        </aside>

        <Separator orientation="vertical" />

        <main className="flex-1 overflow-y-auto">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onUpdate={handleUpdate}
              onAddNote={handleAddNote}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a ticket to view details
            </div>
          )}
        </main>
      </div>

      <NewTicketModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        onCreate={handleCreate}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify app renders without error**

```bash
cd 03-ticket-tracker
npm run dev
```

Expected: Vite starts, browser shows the app shell header and empty state.

- [ ] **Step 4: Commit**

```bash
git add 03-ticket-tracker/src/main.jsx 03-ticket-tracker/src/App.jsx
git commit -m "feat(tracker): add React entry point and app shell"
```

---

## Task 6: FilterBar Component

**Files:**

- Create: `03-ticket-tracker/src/components/FilterBar.jsx`

- [ ] **Step 1: Write src/components/FilterBar.jsx**

```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['billing', 'technical', 'device', 'account'];
const CUSTOMER_TYPES = ['B2B', 'B2C'];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value || 'all'}
        onValueChange={(v) => onChange(v === 'all' ? undefined : v)}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function FilterBar({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="p-3 space-y-3 border-b">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Filters
      </p>
      <FilterSelect
        label="Status"
        value={filters.status}
        options={STATUSES}
        onChange={(v) => set('status', v)}
      />
      <FilterSelect
        label="Priority"
        value={filters.priority}
        options={PRIORITIES}
        onChange={(v) => set('priority', v)}
      />
      <FilterSelect
        label="Category"
        value={filters.category}
        options={CATEGORIES}
        onChange={(v) => set('category', v)}
      />
      <FilterSelect
        label="Customer type"
        value={filters.customer_type}
        options={CUSTOMER_TYPES}
        onChange={(v) => set('customer_type', v)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/src/components/FilterBar.jsx
git commit -m "feat(tracker): add FilterBar component"
```

---

## Task 7: TicketList Component

**Files:**

- Create: `03-ticket-tracker/src/components/TicketList.jsx`

- [ ] **Step 1: Write src/components/TicketList.jsx**

```jsx
import { Badge } from './ui/badge';
import FilterBar from './FilterBar';

const STATUS_COLORS = {
  open: 'secondary',
  'in-progress': 'default',
  escalated: 'destructive',
  resolved: 'outline',
};

const PRIORITY_COLORS = {
  low: 'outline',
  medium: 'secondary',
  high: 'destructive',
};

export default function TicketList({
  tickets,
  selectedId,
  filters,
  onFilterChange,
  onSelect,
}) {
  return (
    <div className="flex flex-col h-full">
      <FilterBar filters={filters} onChange={onFilterChange} />
      <div className="flex-1 overflow-y-auto divide-y">
        {tickets.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground">
            No tickets match the current filters.
          </p>
        )}
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors ${selectedId === ticket.id ? 'bg-accent' : ''}`}
          >
            <p className="text-sm font-medium truncate">{ticket.title}</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              <Badge variant={STATUS_COLORS[ticket.status]}>
                {ticket.status}
              </Badge>
              <Badge variant={PRIORITY_COLORS[ticket.priority]}>
                {ticket.priority}
              </Badge>
              <Badge variant="outline">{ticket.customer_type}</Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/src/components/TicketList.jsx
git commit -m "feat(tracker): add TicketList component with badge styling"
```

---

## Task 8: NoteItem Component

**Files:**

- Create: `03-ticket-tracker/src/components/NoteItem.jsx`

- [ ] **Step 1: Write src/components/NoteItem.jsx**

```jsx
export default function NoteItem({ note }) {
  const isInternal = note.type === 'internal';
  const borderColor = isInternal ? 'border-yellow-400' : 'border-green-500';
  const label = isInternal ? 'Internal note' : 'Customer reply';
  const time = new Date(note.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`border-l-4 ${borderColor} pl-3 py-2 space-y-1`}>
      <p className="text-xs text-muted-foreground">
        {label} · {time}
      </p>
      <p className="text-sm whitespace-pre-wrap">{note.body}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/src/components/NoteItem.jsx
git commit -m "feat(tracker): add NoteItem component with colour-coded borders"
```

---

## Task 9: TicketDetail Component

**Files:**

- Create: `03-ticket-tracker/src/components/TicketDetail.jsx`

This panel shows the selected ticket's fields, allows status/priority changes, and displays the notes thread with an add-note form.

- [ ] **Step 1: Write src/components/TicketDetail.jsx**

```jsx
import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import NoteItem from './NoteItem';
import { getTicket } from '../storage';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];

export default function TicketDetail({ ticket, onUpdate, onAddNote }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [escalationReason, setEscalationReason] = useState(
    ticket.escalation_reason || '',
  );
  const [noteType, setNoteType] = useState('internal');
  const [noteBody, setNoteBody] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setEscalationReason(ticket.escalation_reason || '');
    const full = getTicket(ticket.id);
    setNotes(full?.notes || []);
  }, [ticket.id, ticket.updated_at]);

  function handleSave() {
    const patch = { status, priority };
    if (status === 'escalated') patch.escalation_reason = escalationReason;
    onUpdate(ticket.id, patch);
  }

  function handleAddNote() {
    if (!noteBody.trim()) return;
    onAddNote(ticket.id, { type: noteType, body: noteBody.trim() });
    setNoteBody('');
    const full = getTicket(ticket.id);
    setNotes(full?.notes || []);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{ticket.title}</h2>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge>{ticket.status}</Badge>
          <Badge variant="outline">{ticket.priority}</Badge>
          <Badge variant="secondary">{ticket.category}</Badge>
          <Badge variant="outline">{ticket.customer_type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Created {new Date(ticket.created_at).toLocaleString()}
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <p className="text-sm font-medium">Update ticket</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {status === 'escalated' && (
          <div className="space-y-1">
            <Label>Escalation reason</Label>
            <Input
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              placeholder="Required for escalation"
            />
          </div>
        )}

        <Button onClick={handleSave}>Save changes</Button>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-sm font-medium">Notes & Replies</p>
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Note type</Label>
          <Select value={noteType} onValueChange={setNoteType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal note</SelectItem>
              <SelectItem value="reply">Customer reply</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Message</Label>
          <Textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Write your note here..."
            rows={3}
          />
        </div>
        <Button onClick={handleAddNote} disabled={!noteBody.trim()}>
          Add note
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/src/components/TicketDetail.jsx
git commit -m "feat(tracker): add TicketDetail component with status/notes management"
```

---

## Task 10: NewTicketModal Component

**Files:**

- Create: `03-ticket-tracker/src/components/NewTicketModal.jsx`

- [ ] **Step 1: Write src/components/NewTicketModal.jsx**

```jsx
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const DEFAULTS = {
  title: '',
  priority: 'medium',
  category: 'technical',
  customer_type: 'B2C',
};

export default function NewTicketModal({ open, onOpenChange, onCreate }) {
  const [fields, setFields] = useState(DEFAULTS);

  function set(key, value) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!fields.title.trim()) return;
    onCreate({ ...fields, title: fields.title.trim() });
    setFields(DEFAULTS);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              value={fields.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Describe the issue"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Priority</Label>
              <Select
                value={fields.priority}
                onValueChange={(v) => set('priority', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['low', 'medium', 'high'].map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={fields.category}
                onValueChange={(v) => set('category', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['billing', 'technical', 'device', 'account'].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Customer type</Label>
            <Select
              value={fields.customer_type}
              onValueChange={(v) => set('customer_type', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2B">B2B</SelectItem>
                <SelectItem value="B2C">B2C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!fields.title.trim()}>
              Create ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/src/components/NewTicketModal.jsx
git commit -m "feat(tracker): add NewTicketModal dialog component"
```

---

## Task 11: README

**Files:**

- Create: `03-ticket-tracker/README.md`

- [ ] **Step 1: Write README.md**

```markdown
# Support Ticket Tracker

A lightweight Zendesk-style support ticket tracker for an EV charging support team. Built with React, Vite, and Shadcn UI. All data persists in the browser via localStorage — no backend required.

## Stack

- React 18 + Vite
- Shadcn UI (Radix UI + Tailwind CSS)
- localStorage (client-side persistence)

## Setup

\`\`\`bash
npm install
npm run dev

# → http://localhost:5173

\`\`\`

## Build

\`\`\`bash
npm run build

# → dist/ folder ready for Vercel or any static host

\`\`\`

## Features

- Create tickets with title, priority, category, and customer type (B2B/B2C)
- Ticket lifecycle: open → in-progress → escalated → resolved (re-openable)
- Escalation requires a reason; `escalated_at` is set only on first escalation
- Filter tickets by status, priority, category, and customer type
- Add internal notes (yellow border) and customer replies (green border) to tickets
- All data persists across page refreshes via localStorage

## Future

Planned: deploy to Vercel for a live URL.
```

- [ ] **Step 2: Commit**

```bash
git add 03-ticket-tracker/README.md
git commit -m "docs(tracker): add README with setup and feature overview"
```

---

## Task 12: Smoke Test

- [ ] **Step 1: Run dev server and verify all acceptance criteria**

```bash
cd 03-ticket-tracker
npm run dev
```

Work through the acceptance criteria checklist in the PRD manually:

- Create a ticket via the modal
- Filter by status, priority, category, customer type
- Click a ticket and see detail panel
- Change status and save
- Set status to `escalated` — confirm reason field appears
- Add an internal note (yellow border) and a customer reply (green border)
- Refresh the page — confirm tickets and notes persist

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: `dist/` folder created with no errors.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(tracker): complete React/Shadcn/localStorage implementation"
```
