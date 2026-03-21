import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import FilterBar from './FilterBar';

const STATUS_VARIANT = {
  open: 'secondary',
  'in-progress': 'default',
  escalated: 'destructive',
  resolved: 'outline',
};

const PRIORITY_VARIANT = {
  low: 'outline',
  medium: 'secondary',
  high: 'destructive',
};

export default function TicketList({ tickets, selectedId, filters, onFilterChange, onSelect }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FilterBar filters={filters} onChange={onFilterChange} />
      <div className="flex-1 overflow-y-auto divide-y">
        {tickets.length === 0 && (
          <p className="p-4 text-sm text-muted-foreground text-center pt-8">
            No tickets match the current filters.
          </p>
        )}
        {tickets.map((ticket) => (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            className={cn(
              'w-full text-left px-4 py-3 hover:bg-accent transition-colors',
              selectedId === ticket.id && 'bg-accent',
            )}
          >
            <p className="text-sm font-medium truncate">{ticket.title}</p>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              <Badge variant={STATUS_VARIANT[ticket.status]} className="text-xs">
                {ticket.status}
              </Badge>
              <Badge variant={PRIORITY_VARIANT[ticket.priority]} className="text-xs">
                {ticket.priority}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {ticket.customer_type}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
