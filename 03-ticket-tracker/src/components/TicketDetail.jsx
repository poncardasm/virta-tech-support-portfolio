import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import NoteItem from './NoteItem';
import { getTicket } from '@/storage';
import { SaveIcon, PlusIcon, AlertTriangleIcon } from 'lucide-react';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];

const STATUS_STYLE = {
  open:         'text-[var(--status-open-color)]      bg-[var(--status-open-bg)]      border border-[var(--status-open-border)]',
  'in-progress':'text-[var(--status-progress-color)]  bg-[var(--status-progress-bg)]  border border-[var(--status-progress-border)]',
  escalated:    'text-[var(--status-escalated-color)] bg-[var(--status-escalated-bg)] border border-[var(--status-escalated-border)]',
  resolved:     'text-[var(--status-resolved-color)]  bg-[var(--status-resolved-bg)]  border border-[var(--status-resolved-border)]',
};

const CATEGORY_LABEL = {
  billing: 'Billing',
  technical: 'Technical',
  device: 'Device',
  account: 'Account',
};

export default function TicketDetail({ ticket, onUpdate, onAddNote }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [escalationReason, setEscalationReason] = useState(ticket.escalation_reason || '');
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

  const isDirty =
    status !== ticket.status ||
    priority !== ticket.priority ||
    (status === 'escalated' && escalationReason !== (ticket.escalation_reason || ''));

  return (
    <div className="p-6 max-w-2xl">
      {/* ── Ticket header ── */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-base font-semibold leading-snug">{ticket.title}</h2>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium leading-none shrink-0 mt-0.5 ${STATUS_STYLE[ticket.status]}`}>
            {ticket.status}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground uppercase tracking-wider">
            {ticket.priority} priority
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground uppercase tracking-wider">
            {CATEGORY_LABEL[ticket.category]}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
            {ticket.customer_type}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/60">
          <span>Opened {new Date(ticket.created_at).toLocaleString()}</span>
          <span>·</span>
          <span>Updated {new Date(ticket.updated_at).toLocaleString()}</span>
        </div>

        {ticket.escalated_at && (
          <div className="mt-2 flex items-start gap-1.5 text-[10px] font-mono text-[var(--status-escalated-color)]">
            <AlertTriangleIcon className="size-3 mt-0.5 shrink-0" />
            <span>
              Escalated {new Date(ticket.escalated_at).toLocaleString()}
              {ticket.escalation_reason && ` — ${ticket.escalation_reason}`}
            </span>
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* ── Update ticket ── */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground/70 mb-3 uppercase tracking-wide font-mono">
          Update ticket
        </p>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel className="text-xs">Status</FieldLabel>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="cursor-pointer text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer text-sm">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel className="text-xs">Priority</FieldLabel>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="cursor-pointer text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="cursor-pointer text-sm">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {status === 'escalated' && (
            <Field>
              <FieldLabel className="text-xs">Escalation reason</FieldLabel>
              <Input
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Describe why this ticket is being escalated"
                className="text-sm"
              />
            </Field>
          )}
        </FieldGroup>

        <div className="mt-3">
          <Button
            onClick={handleSave}
            disabled={!isDirty}
            size="sm"
            className="cursor-pointer h-8 text-xs gap-1.5"
          >
            <SaveIcon className="size-3" />
            Save changes
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* ── Notes thread ── */}
      <div className="mb-6">
        <p className="text-xs font-medium text-foreground/70 mb-3 uppercase tracking-wide font-mono">
          Notes & Replies
          {notes.length > 0 && (
            <span className="ml-2 text-muted-foreground/50 normal-case tracking-normal font-normal">
              ({notes.length})
            </span>
          )}
        </p>
        {notes.length === 0 ? (
          <p className="text-xs text-muted-foreground/50 font-mono">No notes yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* ── Add note ── */}
      <div>
        <p className="text-xs font-medium text-foreground/70 mb-3 uppercase tracking-wide font-mono">
          Add note
        </p>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-xs">Type</FieldLabel>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="cursor-pointer text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="internal" className="cursor-pointer text-sm">Internal note</SelectItem>
                  <SelectItem value="reply" className="cursor-pointer text-sm">Customer reply</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel className="text-xs">Message</FieldLabel>
            <Textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder={
                noteType === 'internal'
                  ? 'Diagnosis notes, L2 context, investigation findings...'
                  : 'Response to send to the customer...'
              }
              rows={3}
              className="text-sm resize-none"
            />
          </Field>
        </FieldGroup>
        <div className="mt-3">
          <Button
            onClick={handleAddNote}
            disabled={!noteBody.trim()}
            size="sm"
            variant="outline"
            className="cursor-pointer h-8 text-xs gap-1.5"
          >
            <PlusIcon className="size-3" />
            Add note
          </Button>
        </div>
      </div>
    </div>
  );
}
