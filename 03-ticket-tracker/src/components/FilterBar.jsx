import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['billing', 'technical', 'device', 'account'];
const CUSTOMER_TYPES = ['B2B', 'B2C'];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <Field>
      <FieldLabel className="text-xs">{label}</FieldLabel>
      <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? undefined : v)}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            {options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

const hasActiveFilters = (filters) =>
  Object.values(filters).some(Boolean);

export default function FilterBar({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="p-3 border-b shrink-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filters
        </p>
        {hasActiveFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs text-muted-foreground"
            onClick={() => onChange({})}
          >
            <XIcon data-icon="inline-start" />
            Clear
          </Button>
        )}
      </div>
      <FieldGroup className="gap-2">
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
      </FieldGroup>
    </div>
  );
}
