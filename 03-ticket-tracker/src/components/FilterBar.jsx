import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['billing', 'technical', 'device', 'account'];
const CUSTOMER_TYPES = ['B2B', 'B2C'];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-mono text-muted-foreground/70 uppercase tracking-widest">{label}</p>
      <Select value={value || 'all'} onValueChange={(v) => onChange(v === 'all' ? undefined : v)}>
        <SelectTrigger className="h-7 text-xs cursor-pointer bg-input/50 border-border/60">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all" className="cursor-pointer text-xs">All</SelectItem>
            {options.map((o) => (
              <SelectItem key={o} value={o} className="cursor-pointer text-xs">
                {o}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

const hasActiveFilters = (filters) => Object.values(filters).some(Boolean);

export default function FilterBar({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="p-3 border-b border-border shrink-0">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
          Filters
        </span>
        {hasActiveFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-[10px] font-mono cursor-pointer text-muted-foreground hover:text-foreground gap-1"
            onClick={() => onChange({})}
          >
            <XIcon className="size-2.5" />
            Clear
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2">
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
          label="Customer"
          value={filters.customer_type}
          options={CUSTOMER_TYPES}
          onChange={(v) => set('customer_type', v)}
        />
      </div>
    </div>
  );
}
