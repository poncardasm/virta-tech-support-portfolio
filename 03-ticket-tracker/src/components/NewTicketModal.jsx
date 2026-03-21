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
      <DialogContent className="sm:max-w-[420px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border/60">
          <DialogTitle className="text-[14px] font-semibold">New ticket</DialogTitle>
          <DialogDescription className="text-[12px] text-muted-foreground mt-0.5">
            Log a new issue to the support queue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel className="text-[11px] font-medium text-muted-foreground">Title</FieldLabel>
                <Input
                  value={fields.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="Briefly describe the issue"
                  autoFocus
                  required
                  className="text-sm h-8"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel className="text-[11px] font-medium text-muted-foreground">Priority</FieldLabel>
                  <Select value={fields.priority} onValueChange={(v) => set('priority', v)}>
                    <SelectTrigger className="cursor-pointer text-sm h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {['low', 'medium', 'high'].map((p) => (
                          <SelectItem key={p} value={p} className="cursor-pointer text-sm capitalize">{p}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel className="text-[11px] font-medium text-muted-foreground">Category</FieldLabel>
                  <Select value={fields.category} onValueChange={(v) => set('category', v)}>
                    <SelectTrigger className="cursor-pointer text-sm h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {['billing', 'technical', 'device', 'account'].map((c) => (
                          <SelectItem key={c} value={c} className="cursor-pointer text-sm capitalize">{c}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel className="text-[11px] font-medium text-muted-foreground">Customer type</FieldLabel>
                <Select value={fields.customer_type} onValueChange={(v) => set('customer_type', v)}>
                  <SelectTrigger className="cursor-pointer text-sm h-8">
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
          </div>

          <DialogFooter className="px-5 py-3 border-t border-border/60 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="cursor-pointer text-xs h-7 px-3 text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="cursor-pointer text-xs h-7 px-3"
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
