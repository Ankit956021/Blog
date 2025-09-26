const express = require('express');
const router = express.Router();
const appwriteService = require('../services/appwriteService');

// Create new support ticket
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message, priority } = req.body;
        
        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, subject, and message are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        const ticketData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
            priority: priority || 'medium'
        };
        
        const newTicket = await appwriteService.createSupportTicket(ticketData);
        
        res.status(201).json({
            success: true,
            data: newTicket,
            message: 'Support ticket created successfully. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create support ticket',
            error: error.message
        });
    }
});

// Get all support tickets (admin only)
router.get('/admin/all', async (req, res) => {
    try {
        const { status = 'all', priority = 'all', limit = 50, offset = 0 } = req.query;
        const { Query } = require('node-appwrite');
        
        let queries = [
            Query.orderDesc('created_at'),
            Query.limit(parseInt(limit)),
            Query.offset(parseInt(offset))
        ];
        
        if (status !== 'all') {
            queries.push(Query.equal('status', status));
        }
        
        if (priority !== 'all') {
            queries.push(Query.equal('priority', priority));
        }
        
        const tickets = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.support,
            queries
        );
        
        res.status(200).json({
            success: true,
            data: tickets.documents || [],
            total: tickets.total || 0,
            message: 'Support tickets fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching support tickets:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch support tickets',
            error: error.message
        });
    }
});

// Update support ticket status (admin only)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validation
        if (!['open', 'in_progress', 'closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be: open, in_progress, or closed'
            });
        }
        
        const updatedTicket = await appwriteService.db.updateDocument(
            appwriteService.databaseId,
            appwriteService.collections.support,
            id,
            { status }
        );
        
        res.status(200).json({
            success: true,
            data: updatedTicket,
            message: `Support ticket status updated to ${status}`
        });
    } catch (error) {
        console.error('Error updating support ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update support ticket',
            error: error.message
        });
    }
});

// Get support ticket statistics
router.get('/stats', async (req, res) => {
    try {
        const { Query } = require('node-appwrite');
        
        const openTickets = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.support,
            [Query.equal('status', 'open'), Query.limit(1)]
        );
        
        const inProgressTickets = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.support,
            [Query.equal('status', 'in_progress'), Query.limit(1)]
        );
        
        const closedTickets = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.support,
            [Query.equal('status', 'closed'), Query.limit(1)]
        );
        
        const highPriorityTickets = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.support,
            [Query.equal('priority', 'high'), Query.limit(1)]
        );
        
        res.status(200).json({
            success: true,
            data: {
                open: openTickets.total || 0,
                in_progress: inProgressTickets.total || 0,
                closed: closedTickets.total || 0,
                high_priority: highPriorityTickets.total || 0,
                total: (openTickets.total || 0) + (inProgressTickets.total || 0) + (closedTickets.total || 0)
            },
            message: 'Support ticket statistics fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching support stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch support statistics',
            error: error.message
        });
    }
});

// Delete support ticket (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await appwriteService.db.deleteDocument(
            appwriteService.databaseId,
            appwriteService.collections.support,
            id
        );
        
        res.status(200).json({
            success: true,
            message: 'Support ticket deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting support ticket:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete support ticket',
            error: error.message
        });
    }
});

module.exports = router;
