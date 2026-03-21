export default function NoteItem({ note }) {
  const isInternal = note.type === 'internal';
  const time = new Date(note.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(note.created_at).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className={
        isInternal
          ? 'border-l-2 border-l-[oklch(0.80_0.17_55)] bg-[oklch(0.80_0.17_55_/_0.06)] pl-3 pr-4 py-2.5 rounded-r-md'
          : 'border-l-2 border-l-[oklch(0.72_0.16_160)] bg-[oklch(0.72_0.16_160_/_0.06)] pl-3 pr-4 py-2.5 rounded-r-md'
      }
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={
            isInternal
              ? 'text-[10px] font-mono font-medium text-[oklch(0.80_0.17_55)] uppercase tracking-wider'
              : 'text-[10px] font-mono font-medium text-[oklch(0.72_0.16_160)] uppercase tracking-wider'
          }
        >
          {isInternal ? 'Internal' : 'Customer reply'}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/60">
          {date} · {time}
        </span>
      </div>
      <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{note.body}</p>
    </div>
  );
}
