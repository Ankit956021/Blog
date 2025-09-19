const express = require('express');
const router = express.Router();

// Sample support tickets
let tickets = [
    {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        subject: "Login Issue",
        message: "I can't log into my account",
        status: "open",
        priority: "medium",
        date: "2024-01-15"
    }
];

// GET /api/support/tickets - Get all tickets
router.get('/tickets', (req, res) => {
    try {
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets' });
    }
});

// POST /api/support/tickets - Create new ticket
router.post('/tickets', (req, res) => {
    try {
        const { name, email, subject, message, priority = 'medium' } = req.body;
        
        const newTicket = {
            id: tickets.length + 1,
            name,
            email,
            subject,
            message,
            priority,
            status: 'open',
            date: new Date().toISOString().split('T')[0]
        };
        
        tickets.push(newTicket);
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket' });
    }
});

// PUT /api/support/tickets/:id - Update ticket status
router.put('/tickets/:id', (req, res) => {
    try {
        const ticketIndex = tickets.findIndex(t => t.id === parseInt(req.params.id));
        if (ticketIndex === -1) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        tickets[ticketIndex] = { ...tickets[ticketIndex], ...req.body };
        res.json(tickets[ticketIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket' });
    }
});

module.exports = router;
