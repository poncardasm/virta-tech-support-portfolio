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
import { cn } from '@/lib/utils';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];

const STATUS_STYLE = {
  open:          'text-[var(--s-open-fg)] bg-[var(--s-open-bg)] border-[var(--s-open-border)]',
  'in-progress': 'text-[var(--s-prog-fg)] bg-[var(--s-prog-bg)] border-[var(--s-prog-border)]',
  escalated:     'text-[var(--s-esc-fg)]  bg-[var(--s-esc-bg)]  border-[var(--s-esc-border)]',
  resolved:      'text-[var(--s-res-fg)]  bg-[var(--s-res-bg)]  border-[var(--s-res-border)]',
};

const STATUS_DOT = {
  open:          'bg-[var(--s-open-fg)]',
  'in-progress': 'bg-[var(--s-prog-fg)]',
  escalated:     'bg-[var(--s-esc-fg)]',
  resolved:      'bg-[var(--s-res-fg)]',
};

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

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
    <div className="max-w-2xl px-8 py-7">
      {/* ── Header ── */}
      <div className="mb-7">
        <div className="flex items-start gap-3 mb-3">
          <span className={cn(
            'inline-flex items-center mt-1 size-2 rounded-full shrink-0',
            STATUS_DOT[ticket.status],
          )} />
          <h1 className="text-[17px] font-semibold leading-snug tracking-tight">
            {ticket.title}
          </h1>
        </div>

        {/* Meta pills */}
        <div className="flex items-center gap-1.5 flex-wrap ml-5">
          <span className={cn(
            'inline-flex items-center h-5 px-2 rounded-full border text-[11px] font-medium',
            STATUS_STYLE[ticket.status],
          )}>
            {ticket.status}
          </span>
          <span className="inline-flex items-center h-5 px-2 rounded-full border border-border/60 text-[11px] text-muted-foreground capitalize">
            {ticket.priority}
          </span>
          <span className="inline-flex items-center h-5 px-2 rounded-full border border-border/60 text-[11px] text-muted-foreground capitalize">
            {ticket.category}
          </span>
          <span className="inline-flex items-center h-5 px-2 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-medium text-primary/80">
            {ticket.customer_type}
          </span>
        </div>

        {/* Timestamps */}
        <div className="flex items-center gap-2 ml-5 mt-2.5 text-[11px] text-muted-foreground/50">
          <span>Opened {new Date(ticket.created_at).toLocaleString()}</span>
          <span>·</span>
          <span>Updated {new Date(ticket.updated_at).toLocaleString()}</span>
        </div>

        {ticket.escalated_at && (
          <div className="ml-5 mt-2 flex items-start gap-1.5 text-[11px] text-[var(--s-esc-fg)]/80">
            <AlertTriangleIcon className="size-3 mt-px shrink-0" />
            <span>
              Escalated {new Date(ticket.escalated_at).toLocaleString()}
              {ticket.escalation_reason && ` — ${ticket.escalation_reason}`}
            </span>
          </div>
        )}
      </div>

      <Separator className="mb-7 opacity-50" />

      {/* ── Update ── */}
      <div className="mb-7">
        <SectionLabel>Update ticket</SectionLabel>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel className="text-xs">Status</FieldLabel>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="cursor-pointer text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer text-sm">{s}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel className="text-xs">Priority</FieldLabel>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="cursor-pointer text-sm h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p} className="cursor-pointer text-sm capitalize">{p}</SelectItem>
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
                placeholder="Why is this ticket being escalated?"
                className="text-sm h-8"
              />
            </Field>
          )}
        </FieldGroup>

        <Button
          onClick={handleSave}
          disabled={!isDirty}
          size="sm"
          className="mt-3 cursor-pointer h-7 text-xs px-3 gap-1.5"
        >
          <SaveIcon className="size-3" />
          Save changes
        </Button>
      </div>

      <Separator className="mb-7 opacity-50" />

      {/* ── Notes ── */}
      <div className="mb-7">
        <SectionLabel>
          Notes & Replies{notes.length > 0 && ` (${notes.length})`}
        </SectionLabel>
        {notes.length === 0 ? (
          <p className="text-[12px] text-muted-foreground/40">No notes yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      <Separator className="mb-7 opacity-50" />

      {/* ── Add note ── */}
      <div>
        <SectionLabel>Add note</SectionLabel>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-xs">Type</FieldLabel>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="cursor-pointer text-sm h-8">
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
                  ? 'Diagnosis notes, context, investigation findings...'
                  : 'Response to send to the customer...'
              }
              rows={3}
              className="text-sm resize-none"
            />
          </Field>
        </FieldGroup>
        <Button
          onClick={handleAddNote}
          disabled={!noteBody.trim()}
          size="sm"
          variant="outline"
          className="mt-3 cursor-pointer h-7 text-xs px-3 gap-1.5"
        >
          <PlusIcon className="size-3" />
          Add note
        </Button>
      </div>
    </div>
  );
}
