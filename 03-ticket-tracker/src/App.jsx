import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, addNote } from './storage';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import NewTicketModal from './components/NewTicketModal';
import Dashboard from './components/Dashboard';
import { Button } from './components/ui/button';
import { PlusIcon } from 'lucide-react';

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

  const filtered = tickets.filter((t) =>
    (!filters.status || t.status === filters.status) &&
    (!filters.priority || t.priority === filters.priority) &&
    (!filters.category || t.category === filters.category) &&
    (!filters.customer_type || t.customer_type === filters.customer_type)
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-border flex flex-col shrink-0 bg-sidebar">
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-md bg-primary/90 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L8.5 9H1.5L5 1Z" fill="white" fillOpacity="0.9" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-tight">EV Support</span>
          </div>
          <Button
            onClick={() => setShowNewModal(true)}
            size="icon"
            variant="ghost"
            className="size-6 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
            title="New Ticket"
          >
            <PlusIcon className="size-3.5" />
          </Button>
        </div>

        {/* Nav label */}
        <div className="px-4 pt-4 pb-1.5">
          <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Queue
          </span>
        </div>

        {/* Ticket list fills sidebar */}
        <TicketList
          tickets={filtered}
          selectedId={selectedId}
          filters={filters}
          onFilterChange={setFilters}
          onSelect={setSelectedId}
        />
      </aside>

      {/* ── Main panel ── */}
      <main className="flex-1 overflow-y-auto bg-background">
        {selectedTicket ? (
          <TicketDetail
            ticket={selectedTicket}
            onUpdate={handleUpdate}
            onAddNote={handleAddNote}
          />
        ) : (
          <Dashboard
            tickets={tickets}
            onNewTicket={() => setShowNewModal(true)}
            onSelectTicket={setSelectedId}
          />
        )}
      </main>

      <NewTicketModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        onCreate={handleCreate}
      />
    </div>
  );
}
