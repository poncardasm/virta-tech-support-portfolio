export default function NoteItem({ note }) {
  const isInternal = note.type === 'internal';
  const borderColor = isInternal ? 'border-yellow-400' : 'border-green-500';
  const bgColor = isInternal ? 'bg-yellow-50' : 'bg-green-50';
  const label = isInternal ? 'Internal note' : 'Customer reply';
  const time = new Date(note.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(note.created_at).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`border-l-4 ${borderColor} ${bgColor} pl-3 pr-4 py-2.5 rounded-r-md space-y-1`}>
      <p className="text-xs text-muted-foreground font-medium">
        {label} · {date} {time}
      </p>
      <p className="text-sm whitespace-pre-wrap">{note.body}</p>
    </div>
  );
}
