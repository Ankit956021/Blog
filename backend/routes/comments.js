const express = require('express');
const router = express.Router();

// Sample comments data
let comments = [
    {
        id: 1,
        blogId: 1,
        author: "Alice Johnson",
        email: "alice@example.com",
        content: "Great article! Very informative.",
        date: "2024-01-16",
        status: "approved"
    },
    {
        id: 2,
        blogId: 1,
        author: "Bob Wilson",
        email: "bob@example.com",
        content: "Thanks for sharing this knowledge.",
        date: "2024-01-17",
        status: "pending"
    }
];

// GET /api/comments - Get all comments
router.get('/', (req, res) => {
    try {
        const { blogId, status } = req.query;
        let filteredComments = comments;
        
        if (blogId) {
            filteredComments = filteredComments.filter(c => c.blogId === parseInt(blogId));
        }
        
        if (status) {
            filteredComments = filteredComments.filter(c => c.status === status);
        }
        
        res.json(filteredComments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

// POST /api/comments - Add new comment
router.post('/', (req, res) => {
    try {
        const { blogId, author, email, content } = req.body;
        
        const newComment = {
            id: comments.length + 1,
            blogId: parseInt(blogId),
            author,
            email,
            content,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        
        comments.push(newComment);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// PUT /api/comments/:id/approve - Approve comment
router.put('/:id/approve', (req, res) => {
    try {
        const commentIndex = comments.findIndex(c => c.id === parseInt(req.params.id));
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        comments[commentIndex].status = 'approved';
        res.json(comments[commentIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error approving comment' });
    }
});

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', (req, res) => {
    try {
        const commentIndex = comments.findIndex(c => c.id === parseInt(req.params.id));
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        
        comments.splice(commentIndex, 1);
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment' });
    }
});

module.exports = router;
