import { cn } from '@/lib/utils';
import FilterBar from './FilterBar';

/* Semantic status styles — inline CSS vars, not raw color classes */
const STATUS_STYLE = {
  open:         'text-[var(--status-open-color)]      bg-[var(--status-open-bg)]      border border-[var(--status-open-border)]',
  'in-progress':'text-[var(--status-progress-color)]  bg-[var(--status-progress-bg)]  border border-[var(--status-progress-border)]',
  escalated:    'text-[var(--status-escalated-color)] bg-[var(--status-escalated-bg)] border border-[var(--status-escalated-border)]',
  resolved:     'text-[var(--status-resolved-color)]  bg-[var(--status-resolved-bg)]  border border-[var(--status-resolved-border)]',
};

const PRIORITY_STYLE = {
  high:   'text-[var(--priority-high-color)]   bg-[var(--priority-high-bg)]',
  medium: 'text-[var(--priority-medium-color)] bg-[var(--priority-medium-bg)]',
  low:    'text-[var(--priority-low-color)]    bg-[var(--priority-low-bg)]',
};

function StatusPip({ status }) {
  const color = {
    open: 'bg-[var(--status-open-color)]',
    'in-progress': 'bg-[var(--status-progress-color)]',
    escalated: 'bg-[var(--status-escalated-color)]',
    resolved: 'bg-[var(--status-resolved-color)]',
  }[status];
  return <span className={cn('inline-block size-1.5 rounded-full shrink-0 mt-0.5', color)} />;
}

export default function TicketList({ tickets, selectedId, filters, onFilterChange, onSelect }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <FilterBar filters={filters} onChange={onFilterChange} />

      <div className="flex-1 overflow-y-auto">
        {tickets.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-xs text-muted-foreground">No tickets match filters</p>
          </div>
        )}

        {tickets.map((ticket) => {
          const isSelected = selectedId === ticket.id;
          return (
            <button
              key={ticket.id}
              onClick={() => onSelect(ticket.id)}
              className={cn(
                'w-full text-left px-4 py-3 border-b border-border transition-colors relative',
                'hover:bg-accent/60 cursor-pointer',
                isSelected && 'bg-accent border-l-2 border-l-primary pl-[14px]',
              )}
            >
              <div className="flex items-start gap-2">
                <StatusPip status={ticket.status} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-xs font-medium truncate leading-snug',
                    isSelected ? 'text-foreground' : 'text-foreground/80',
                  )}>
                    {ticket.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className={cn(
                      'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium leading-none',
                      STATUS_STYLE[ticket.status],
                    )}>
                      {ticket.status}
                    </span>
                    <span className={cn(
                      'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium leading-none',
                      PRIORITY_STYLE[ticket.priority],
                    )}>
                      {ticket.priority}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium leading-none text-muted-foreground bg-muted/60">
                      {ticket.customer_type}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
