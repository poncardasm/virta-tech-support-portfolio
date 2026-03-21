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
          <DialogTitle className="text-sm font-semibold">New support ticket</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-mono">
            Log a new issue to the support queue
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="py-1">
            <Field>
              <FieldLabel className="text-xs">Issue title</FieldLabel>
              <Input
                value={fields.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Briefly describe the issue"
                autoFocus
                required
                className="text-sm"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel className="text-xs">Priority</FieldLabel>
                <Select value={fields.priority} onValueChange={(v) => set('priority', v)}>
                  <SelectTrigger className="cursor-pointer text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['low', 'medium', 'high'].map((p) => (
                        <SelectItem key={p} value={p} className="cursor-pointer text-sm capitalize">
                          {p}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel className="text-xs">Category</FieldLabel>
                <Select value={fields.category} onValueChange={(v) => set('category', v)}>
                  <SelectTrigger className="cursor-pointer text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['billing', 'technical', 'device', 'account'].map((c) => (
                        <SelectItem key={c} value={c} className="cursor-pointer text-sm capitalize">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-xs">Customer type</FieldLabel>
              <Select value={fields.customer_type} onValueChange={(v) => set('customer_type', v)}>
                <SelectTrigger className="cursor-pointer text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="B2B" className="cursor-pointer text-sm">B2B — Fleet / Business</SelectItem>
                    <SelectItem value="B2C" className="cursor-pointer text-sm">B2C — Individual</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer text-xs"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="cursor-pointer text-xs"
              disabled={!fields.title.trim()}
            >
              Create ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
