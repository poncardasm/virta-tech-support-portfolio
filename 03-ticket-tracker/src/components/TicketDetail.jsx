import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { SaveIcon, PlusIcon } from 'lucide-react';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];

const STATUS_VARIANT = {
  open: 'secondary',
  'in-progress': 'default',
  escalated: 'destructive',
  resolved: 'outline',
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
    <div className="p-6 max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold leading-snug">{ticket.title}</h2>
          <Badge variant={STATUS_VARIANT[ticket.status]} className="shrink-0 mt-0.5">
            {ticket.status}
          </Badge>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="outline">{ticket.priority}</Badge>
          <Badge variant="secondary">{ticket.category}</Badge>
          <Badge variant="outline">{ticket.customer_type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Opened {new Date(ticket.created_at).toLocaleString()} ·{' '}
          Updated {new Date(ticket.updated_at).toLocaleString()}
        </p>
        {ticket.escalated_at && (
          <p className="text-xs text-destructive mt-1">
            Escalated {new Date(ticket.escalated_at).toLocaleString()}
            {ticket.escalation_reason && ` · ${ticket.escalation_reason}`}
          </p>
        )}
      </div>

      <Separator />

      {/* Update ticket */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Update ticket</p>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
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
              <FieldLabel>Escalation reason</FieldLabel>
              <Input
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Required for escalation"
              />
            </Field>
          )}
        </FieldGroup>

        <Button onClick={handleSave} disabled={!isDirty} size="sm">
          <SaveIcon data-icon="inline-start" />
          Save changes
        </Button>
      </div>

      <Separator />

      {/* Notes thread */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Notes & Replies</p>
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Add note */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Add note</p>
        <FieldGroup>
          <Field>
            <FieldLabel>Note type</FieldLabel>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="internal">Internal note</SelectItem>
                  <SelectItem value="reply">Customer reply</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <Textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder={
                noteType === 'internal'
                  ? 'Add diagnosis notes, L2 context, or investigation findings...'
                  : 'Write a response to send to the customer...'
              }
              rows={3}
            />
          </Field>
        </FieldGroup>
        <Button onClick={handleAddNote} disabled={!noteBody.trim()} size="sm">
          <PlusIcon data-icon="inline-start" />
          Add note
        </Button>
      </div>
    </div>
  );
}
