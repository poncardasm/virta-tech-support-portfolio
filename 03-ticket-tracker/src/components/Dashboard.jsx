import { PlusIcon, AlertTriangleIcon, ClockIcon, CheckCircleIcon, ZapIcon } from 'lucide-react';

const STATUS_CONFIG = {
  open:        { label: 'Open',        color: 'bg-blue-500',   light: 'bg-blue-50 text-blue-700 border-blue-200' },
  'in-progress':{ label: 'In Progress', color: 'bg-amber-400',  light: 'bg-amber-50 text-amber-700 border-amber-200' },
  escalated:   { label: 'Escalated',   color: 'bg-red-500',    light: 'bg-red-50 text-red-700 border-red-200' },
  resolved:    { label: 'Resolved',    color: 'bg-green-500',  light: 'bg-green-50 text-green-700 border-green-200' },
};

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: 'bg-red-400' },
  medium: { label: 'Medium', color: 'bg-amber-400' },
  low:    { label: 'Low',    color: 'bg-slate-300' },
};

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`size-7 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="size-3.5" />
        </div>
      </div>
      <div>
        <span className="text-3xl font-semibold tracking-tight">{value}</span>
        {sub != null && (
          <span className="text-xs text-muted-foreground ml-2">{sub}</span>
        )}
      </div>
    </div>
  );
}

function BarRow({ label, count, total, colorClass }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-muted-foreground w-24 shrink-0 capitalize">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${colorClass} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[12px] font-medium w-5 text-right">{count}</span>
    </div>
  );
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Dashboard({ tickets, onNewTicket, onSelectTicket }) {
  const total = tickets.length;

  const byStatus = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map((s) => [s, tickets.filter((t) => t.status === s).length])
  );

  const byPriority = Object.fromEntries(
    Object.keys(PRIORITY_CONFIG).map((p) => [p, tickets.filter((t) => t.priority === p).length])
  );

  const byCategory = tickets.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const escalated = byStatus.escalated;
  const openHigh = tickets.filter((t) => t.status === 'open' && t.priority === 'high').length;
  const resolvedToday = tickets.filter((t) => {
    if (t.status !== 'resolved') return false;
    return Date.now() - new Date(t.updated_at).getTime() < 24 * 60 * 60 * 1000;
  }).length;

  const recent = [...tickets]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-8 py-8 space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Queue overview</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{total} tickets total</p>
        </div>
        <button
          onClick={onNewTicket}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="size-3.5" />
          New ticket
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard icon={ZapIcon}           label="Total"     value={total}       accent="bg-primary/10 text-primary" />
        <StatCard icon={AlertTriangleIcon} label="Escalated" value={escalated}   sub={escalated > 0 ? 'needs attention' : undefined} accent="bg-red-50 text-red-500" />
        <StatCard icon={ClockIcon}         label="Open high" value={openHigh}    accent="bg-amber-50 text-amber-500" />
        <StatCard icon={CheckCircleIcon}   label="Resolved today" value={resolvedToday} accent="bg-green-50 text-green-500" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Status breakdown */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">By status</h2>
          <div className="space-y-2.5">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <BarRow key={key} label={cfg.label} count={byStatus[key]} total={total} colorClass={cfg.color} />
            ))}
          </div>
        </div>

        {/* Priority + Category */}
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">By priority</h2>
            <div className="space-y-2.5">
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <BarRow key={key} label={cfg.label} count={byPriority[key] || 0} total={total} colorClass={cfg.color} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">By category</h2>
            <div className="space-y-2.5">
              {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <BarRow key={cat} label={cat} count={count} total={total} colorClass="bg-primary/60" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Recently updated</h2>
        <div className="divide-y divide-border">
          {recent.map((t) => {
            const sc = STATUS_CONFIG[t.status];
            return (
              <button
                key={t.id}
                onClick={() => onSelectTicket(t.id)}
                className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-muted/40 -mx-1 px-1 rounded cursor-pointer transition-colors group"
              >
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${sc?.light}`}>
                  {sc?.label}
                </span>
                <span className="flex-1 text-[13px] truncate group-hover:text-primary transition-colors">{t.title}</span>
                <span className="text-[11px] text-muted-foreground shrink-0">{timeAgo(t.updated_at)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
