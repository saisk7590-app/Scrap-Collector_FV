import React, { useState } from "react";
import "./SupportPage.css";

export  function Support() {
  const [tickets, setTickets] = useState([
    {
      id: "TCK-101",
      userType: "Customer",
      name: "Rahul Sharma",
      issue: "Pickup was delayed by 2 days.",
      priority: "High",
      status: "Open",
    },
    {
      id: "TCK-102",
      userType: "Collector",
      name: "Imran Khan",
      issue: "App crashing during confirmation.",
      priority: "Medium",
      status: "Open",
    },
    {
      id: "TCK-103",
      userType: "Customer",
      name: "Anita Verma",
      issue: "Wrong payment amount credited.",
      priority: "Low",
      status: "Resolved",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleResolve = (id) => {
    if (!window.confirm("Mark this ticket as resolved?")) return;

    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, status: "Resolved" } : ticket
    );
    setTickets(updated);
  };

  const handleReplySubmit = () => {
    if (!replyMessage) return alert("Enter reply message.");

    alert("Reply sent successfully!");
    setReplyMessage("");
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.name.toLowerCase().includes(search.toLowerCase()) ||
      ticket.issue.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="support-page">

      <div className="page-header">
        <h2>Support Tickets</h2>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Tickets</h4>
          <p>{tickets.length}</p>
        </div>
        <div className="stat-card">
          <h4>Open</h4>
          <p>{tickets.filter(t => t.status === "Open").length}</p>
        </div>
        <div className="stat-card">
          <h4>Resolved</h4>
          <p>{tickets.filter(t => t.status === "Resolved").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by ID, name, issue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Open</option>
          <option>Resolved</option>
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-card">
        {filteredTickets.length === 0 ? (
          <div className="empty-state">No tickets found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>User Type</th>
                <th>Name</th>
                <th>Issue</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.userType}</td>
                  <td>{ticket.name}</td>
                  <td>{ticket.issue}</td>
                  <td>
                    <span className={`badge ${ticket.priority.toLowerCase()}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${ticket.status.toLowerCase()}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td>
                    {ticket.status === "Open" ? (
                      <>
                        <button
                          className="resolve-btn"
                          onClick={() => handleResolve(ticket.id)}
                        >
                          Resolve
                        </button>
                        <button
                          className="reply-btn"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          Reply
                        </button>
                      </>
                    ) : (
                      <span className="resolved-text">No Actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reply to {selectedTicket.name}</h3>
            <textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleReplySubmit} className="primary-btn">
                Send Reply
              </button>
              <button onClick={() => setSelectedTicket(null)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}