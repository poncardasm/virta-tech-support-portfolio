import { cn } from '@/lib/utils';
import FilterBar from './FilterBar';

const STATUS_DOT = {
  open:         'bg-[var(--s-open-fg)]',
  'in-progress':'bg-[var(--s-prog-fg)]',
  escalated:    'bg-[var(--s-esc-fg)]',
  resolved:     'bg-[var(--s-res-fg)]',
};

const STATUS_LABEL = {
  open: 'Open',
  'in-progress': 'In progress',
  escalated: 'Escalated',
  resolved: 'Resolved',
};

const PRIORITY_DOT = {
  high:   'text-[var(--p-high-fg)]',
  medium: 'text-[var(--p-med-fg)]',
  low:    'text-[var(--p-low-fg)]',
};

export default function TicketList({ tickets, selectedId, filters, onFilterChange, onSelect }) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      <FilterBar filters={filters} onChange={onFilterChange} />

      <div className="flex-1 overflow-y-auto py-1">
        {tickets.length === 0 && (
          <p className="px-4 py-6 text-[12px] text-muted-foreground/50 text-center">
            No tickets
          </p>
        )}

        {tickets.map((ticket) => {
          const isSelected = selectedId === ticket.id;
          return (
            <button
              key={ticket.id}
              onClick={() => onSelect(ticket.id)}
              className={cn(
                'w-full text-left px-3 py-2 mx-1 rounded-md transition-colors cursor-pointer group',
                'relative flex items-start gap-2.5',
                isSelected
                  ? 'bg-accent text-foreground'
                  : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground',
              )}
              style={{ width: 'calc(100% - 8px)' }}
            >
              {/* Status dot */}
              <span
                className={cn(
                  'size-1.5 rounded-full shrink-0 mt-[5px]',
                  STATUS_DOT[ticket.status],
                )}
              />

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium leading-snug truncate">
                  {ticket.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-muted-foreground/60 leading-none">
                    {STATUS_LABEL[ticket.status]}
                  </span>
                  <span className="text-muted-foreground/30 text-[10px]">·</span>
                  <span className={cn('text-[10px] leading-none capitalize', PRIORITY_DOT[ticket.priority])}>
                    {ticket.priority}
                  </span>
                  <span className="text-muted-foreground/30 text-[10px]">·</span>
                  <span className="text-[10px] text-muted-foreground/60 leading-none">
                    {ticket.customer_type}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom: total count */}
      <div className="px-4 py-2 border-t border-sidebar-border shrink-0">
        <p className="text-[10px] text-muted-foreground/40">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
