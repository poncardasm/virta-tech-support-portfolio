import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, addNote } from './storage';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import NewTicketModal from './components/NewTicketModal';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
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

  const filtered = tickets.filter((t) => {
    return (
      (!filters.status || t.status === filters.status) &&
      (!filters.priority || t.priority === filters.priority) &&
      (!filters.category || t.category === filters.category) &&
      (!filters.customer_type || t.customer_type === filters.customer_type)
    );
  });

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-3 border-b shrink-0">
        <div>
          <h1 className="text-base font-semibold">EV Support Ticket Tracker</h1>
          <p className="text-xs text-muted-foreground">Virta Technical Support</p>
        </div>
        <Button onClick={() => setShowNewModal(true)} size="sm">
          <PlusIcon data-icon="inline-start" />
          New Ticket
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r flex flex-col overflow-hidden shrink-0">
          <TicketList
            tickets={filtered}
            selectedId={selectedId}
            filters={filters}
            onFilterChange={setFilters}
            onSelect={setSelectedId}
          />
        </aside>

        <Separator orientation="vertical" />

        <main className="flex-1 overflow-y-auto">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onUpdate={handleUpdate}
              onAddNote={handleAddNote}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <p className="text-sm">Select a ticket to view details</p>
              <p className="text-xs">or create a new one to get started</p>
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
