import { cn } from '@/lib/utils';

export default function NoteItem({ note }) {
  const isInternal = note.type === 'internal';
  const time = new Date(note.created_at).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn(
      'rounded-lg border px-4 py-3 text-sm',
      isInternal
        ? 'bg-[oklch(0.78_0.14_55_/_0.06)] border-[oklch(0.78_0.14_55_/_0.15)]'
        : 'bg-[oklch(0.70_0.14_160_/_0.06)] border-[oklch(0.70_0.14_160_/_0.15)]',
    )}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={cn(
          'text-[11px] font-medium',
          isInternal ? 'text-[var(--s-prog-fg)]' : 'text-[var(--s-res-fg)]',
        )}>
          {isInternal ? 'Internal note' : 'Customer reply'}
        </span>
        <span className="text-[11px] text-muted-foreground/50">{time}</span>
      </div>
      <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
        {note.body}
      </p>
    </div>
  );
}
