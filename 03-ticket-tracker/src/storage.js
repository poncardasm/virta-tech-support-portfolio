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
