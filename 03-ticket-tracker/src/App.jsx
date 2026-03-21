import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, addNote } from './storage';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import NewTicketModal from './components/NewTicketModal';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { PlusIcon, ZapIcon } from 'lucide-react';

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({});
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const selectedTicket = tickets.find((t) => t.id === selectedId) || null;

  function handleCreate(fields) {
    const ticket = createTicket(fields);
    setTickets(getTickets());
    setSelectedId(ticket.id);
    setShowNewModal(false);
  }

  function handleUpdate(id, patch) {
    updateTicket(id, patch);
    setTickets(getTickets());
  }

  function handleAddNote(ticket_id, note) {
    addNote(ticket_id, note);
    setTickets(getTickets());
  }

  const filtered = tickets.filter((t) => {
    return (
      (!filters.status || t.status === filters.status) &&
      (!filters.priority || t.priority === filters.priority) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.customer_type || t.customer_type === filters.customer_type)
    );
  });

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-primary shrink-0" />

      <header className="flex items-center justify-between px-5 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded border border-primary/40 bg-primary/10 flex items-center justify-center shrink-0">
            <ZapIcon className="size-3.5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight leading-none">EV Support Queue</h1>
            <p className="text-[10px] font-mono text-muted-foreground leading-tight mt-0.5 tracking-widest uppercase">
              Virta Technical Support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </span>
          <Button
            onClick={() => setShowNewModal(true)}
            size="sm"
            className="cursor-pointer h-7 text-xs px-3 gap-1.5"
          >
            <PlusIcon className="size-3" />
            New Ticket
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-border flex flex-col overflow-hidden shrink-0 bg-sidebar">
          <TicketList
            tickets={filtered}
            selectedId={selectedId}
            filters={filters}
            onFilterChange={setFilters}
            onSelect={setSelectedId}
          />
        </aside>

        <Separator orientation="vertical" />

        <main className="flex-1 overflow-y-auto bg-background">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onUpdate={handleUpdate}
              onAddNote={handleAddNote}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
              <div className="size-12 rounded-xl border border-border flex items-center justify-center">
                <ZapIcon className="size-5 text-muted-foreground/40" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">No ticket selected</p>
                <p className="text-[10px] font-mono text-muted-foreground/50 tracking-widest uppercase">
                  Select from queue or create new
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <NewTicketModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        onCreate={handleCreate}
      />
    </div>
  );
}
