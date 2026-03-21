import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUSES = ['open', 'in-progress', 'escalated', 'resolved'];
const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['billing', 'technical', 'device', 'account'];
const CUSTOMER_TYPES = ['B2B', 'B2C'];

const hasActiveFilters = (filters) => Object.values(filters).some(Boolean);

function FilterChip({ label, value, options, onChange }) {
  const isActive = !!value;
  return (
    <Select value={value || '__all'} onValueChange={(v) => onChange(v === '__all' ? undefined : v)}>
      <SelectTrigger
        className={cn(
          'h-6 px-2 text-[11px] font-medium rounded-full border gap-1 cursor-pointer transition-colors',
          'shadow-none focus:ring-0 focus:ring-offset-0',
          isActive
            ? 'bg-primary/15 border-primary/30 text-primary hover:bg-primary/20'
            : 'bg-transparent border-border text-muted-foreground hover:border-border/80 hover:text-foreground',
        )}
      >
        <span className="text-muted-foreground/70">{label}:</span>
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent className="text-xs">
        <SelectGroup>
          <SelectItem value="__all" className="cursor-pointer text-xs">All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o} className="cursor-pointer text-xs capitalize">
              {o}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function FilterBar({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="px-3 py-2 border-b border-sidebar-border shrink-0">
      <div className="flex items-center gap-1 flex-wrap">
        <FilterChip
          label="Status"
          value={filters.status}
          options={STATUSES}
          onChange={(v) => set('status', v)}
        />
        <FilterChip
          label="Priority"
          value={filters.priority}
          options={PRIORITIES}
          onChange={(v) => set('priority', v)}
        />
        <FilterChip
          label="Category"
          value={filters.category}
          options={CATEGORIES}
          onChange={(v) => set('category', v)}
        />
        <FilterChip
          label="Type"
          value={filters.customer_type}
          options={CUSTOMER_TYPES}
          onChange={(v) => set('customer_type', v)}
        />
        {hasActiveFilters(filters) && (
          <button
            onClick={() => onChange({})}
            className="size-5 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors cursor-pointer shrink-0"
            title="Clear filters"
          >
            <XIcon className="size-2.5" />
          </button>
        )}
      </div>
    </div>
  );
}
