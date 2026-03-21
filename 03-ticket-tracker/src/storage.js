const TICKETS_KEY = 'tt_tickets';
const NOTES_KEY = 'tt_notes';

const SAMPLE_TICKETS = [
  {
    id: 'sample-001',
    title: 'Charger offline after firmware update',
    status: 'open',
    priority: 'high',
    category: 'technical',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-002',
    title: 'Driver app not showing available chargers',
    status: 'in-progress',
    priority: 'medium',
    category: 'technical',
    customer_type: 'B2C',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-003',
    title: 'Payment failed but session was charged',
    status: 'escalated',
    priority: 'high',
    category: 'billing',
    customer_type: 'B2C',
    escalation_reason: 'Potential duplicate charge — needs finance review',
    escalated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-004',
    title: 'RFID card not recognized at site 42',
    status: 'resolved',
    priority: 'low',
    category: 'technical',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-005',
    title: 'Fleet dashboard shows incorrect kWh totals',
    status: 'open',
    priority: 'medium',
    category: 'account',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-006',
    title: 'Charger stuck in "Preparing" state for 2 hours',
    status: 'in-progress',
    priority: 'high',
    category: 'device',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-007',
    title: 'Invoice not received after monthly billing cycle',
    status: 'open',
    priority: 'low',
    category: 'billing',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-008',
    title: 'Session ended prematurely — cable still connected',
    status: 'escalated',
    priority: 'high',
    category: 'device',
    customer_type: 'B2C',
    escalation_reason: 'Recurring issue on unit EVSE-1187, possible relay fault',
    escalated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-009',
    title: 'Cannot add new payment method in app',
    status: 'resolved',
    priority: 'medium',
    category: 'billing',
    customer_type: 'B2C',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-010',
    title: 'Site admin account locked after password reset',
    status: 'in-progress',
    priority: 'high',
    category: 'account',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-011',
    title: 'Charger power output lower than rated (7.4 kW vs 22 kW)',
    status: 'open',
    priority: 'medium',
    category: 'device',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-012',
    title: 'Subscription plan downgrade not reflected on account',
    status: 'resolved',
    priority: 'low',
    category: 'account',
    customer_type: 'B2C',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-013',
    title: 'OCPP heartbeat timeout — charger dropping offline intermittently',
    status: 'escalated',
    priority: 'high',
    category: 'technical',
    customer_type: 'B2B',
    escalation_reason: 'Affects 6 units at depot — escalated to network team',
    escalated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-014',
    title: 'Guest checkout not working — session fails at authorization',
    status: 'open',
    priority: 'medium',
    category: 'billing',
    customer_type: 'B2C',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-015',
    title: 'New employee cannot be added to fleet account',
    status: 'resolved',
    priority: 'low',
    category: 'account',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-016',
    title: 'Charging session not appearing in history',
    status: 'in-progress',
    priority: 'low',
    category: 'account',
    customer_type: 'B2C',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-017',
    title: 'Physical display on charger unit blank/unresponsive',
    status: 'open',
    priority: 'medium',
    category: 'device',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-018',
    title: 'Roaming charge applied despite home network session',
    status: 'escalated',
    priority: 'medium',
    category: 'billing',
    customer_type: 'B2C',
    escalation_reason: 'Customer disputing €47 charge — awaiting network reconciliation',
    escalated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-019',
    title: 'API key for fleet integration expired',
    status: 'resolved',
    priority: 'high',
    category: 'technical',
    customer_type: 'B2B',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-020',
    title: 'Charger location pin wrong on map — 500m off',
    status: 'open',
    priority: 'low',
    category: 'technical',
    customer_type: 'B2C',
    escalation_reason: null,
    escalated_at: null,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

const SAMPLE_NOTES = [
  {
    id: 'note-001',
    ticket_id: 'sample-001',
    type: 'internal',
    body: 'Firmware version 3.2.1 rolled out yesterday. Charger EVSE-4421 stopped responding after reboot. Remote reset attempted — no effect.',
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-002',
    ticket_id: 'sample-002',
    type: 'reply',
    body: 'Hi! We are looking into this. Can you confirm which app version you are on and your city/region?',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-003',
    ticket_id: 'sample-002',
    type: 'internal',
    body: 'Geofence cache refresh job failed overnight. Likely root cause. Eng ticket filed: ENG-2241.',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-004',
    ticket_id: 'sample-003',
    type: 'internal',
    body: 'Transaction ID TX-88821. Payment processor shows one charge; our records show two. Escalated to finance team with full transaction log.',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-005',
    ticket_id: 'sample-004',
    type: 'reply',
    body: 'RFID whitelist has been refreshed for site 42. Card UID ending in 3F9A should now work. Please test and confirm.',
    created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-006',
    ticket_id: 'sample-004',
    type: 'reply',
    body: 'Confirmed working! Card is now accepted. Thank you.',
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-007',
    ticket_id: 'sample-006',
    type: 'internal',
    body: 'Unit EVSE-2209 at Helsinki depot. OCPP logs show StatusNotification stuck on "Preparing". Attempted remote unlock — status unchanged. Checking if fault relates to contactor.',
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-008',
    ticket_id: 'sample-007',
    type: 'reply',
    body: 'Hello! I can see your March invoice was generated but the email bounced. Could you confirm your billing email address so we can resend?',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-009',
    ticket_id: 'sample-008',
    type: 'internal',
    body: 'Third report this month on EVSE-1187. Relay fault suspected. Escalated to hardware team — unit may need field replacement.',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-010',
    ticket_id: 'sample-009',
    type: 'internal',
    body: 'Root cause: Stripe tokenisation endpoint returned 422 for non-EU cards. Fixed in deploy v2.14.3. Customer confirmed new card added successfully.',
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-011',
    ticket_id: 'sample-010',
    type: 'reply',
    body: 'Your account has been unlocked. The lockout was triggered by 5 failed attempts during the reset flow — a known issue we are patching. You should now be able to log in.',
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-012',
    ticket_id: 'sample-011',
    type: 'internal',
    body: 'Customer reports consistent 7.4 kW on a 22 kW AC unit. Likely single-phase vehicle limitation, but worth confirming charger config. Requested vehicle make/model.',
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-013',
    ticket_id: 'sample-013',
    type: 'internal',
    body: 'Six units at Vantaa depot dropping off every ~90 min. OCPP WebSocket connection drops correlated with ISP maintenance window. Network team engaged — investigating firewall timeout settings.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-014',
    ticket_id: 'sample-014',
    type: 'reply',
    body: 'Hi, we are investigating the guest checkout flow. As a workaround, you can create a free account to start a session immediately. We will update you once the fix is deployed.',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-015',
    ticket_id: 'sample-015',
    type: 'reply',
    body: 'The seat limit on your plan was reached. We have temporarily raised it by one. To add more users permanently, consider upgrading to the Fleet Pro plan.',
    created_at: new Date(Date.now() - 95 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-016',
    ticket_id: 'sample-016',
    type: 'internal',
    body: 'Session TX-99102 completed but write to history table failed — foreign key constraint error logged. Backfill job queued.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-017',
    ticket_id: 'sample-018',
    type: 'internal',
    body: 'eRoaming network (Hubject) misidentified home network operator ID. Transaction flagged as inter-operator. Raised with Hubject partner team. CDR reconciliation pending.',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-018',
    ticket_id: 'sample-019',
    type: 'internal',
    body: 'API key rotated automatically at 90-day policy. Customer not notified — notification email went to spam. New key issued and SMTP allowlist updated.',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'note-019',
    ticket_id: 'sample-019',
    type: 'reply',
    body: 'Your new API key has been sent to your registered email. The integration should resume automatically once updated. Let us know if you need any help.',
    created_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
  },
];

export function initSampleData() {
  if (localStorage.getItem(TICKETS_KEY)) return; // already seeded
  localStorage.setItem(TICKETS_KEY, JSON.stringify(SAMPLE_TICKETS));
  localStorage.setItem(NOTES_KEY, JSON.stringify(SAMPLE_NOTES));
}

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
