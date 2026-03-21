import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New ticket</DialogTitle>
          <DialogDescription>
            Create a support ticket for a customer issue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-2">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                value={fields.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Describe the issue"
                autoFocus
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Priority</FieldLabel>
                <Select value={fields.priority} onValueChange={(v) => set('priority', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['low', 'medium', 'high'].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select value={fields.category} onValueChange={(v) => set('category', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['billing', 'technical', 'device', 'account'].map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel>Customer type</FieldLabel>
              <Select value={fields.customer_type} onValueChange={(v) => set('customer_type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="B2B">B2B — Fleet / Business</SelectItem>
                    <SelectItem value="B2C">B2C — Individual</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
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
