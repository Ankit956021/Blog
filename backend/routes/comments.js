const express = require('express');
const router = express.Router();
const appwriteService = require('../services/appwriteService');

// Get comments for a specific blog
router.get('/blog/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        const { limit = 20, offset = 0 } = req.query;
        
        const comments = await appwriteService.getCommentsByBlogId(blogId);
        
        res.status(200).json({
            success: true,
            data: comments.documents || [],
            total: comments.total || 0,
            message: 'Comments fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
            error: error.message
        });
    }
});

// Create new comment
router.post('/', async (req, res) => {
    try {
        const { blog_id, author_name, author_email, content } = req.body;
        
        // Validation
        if (!blog_id || !author_name || !author_email || !content) {
            return res.status(400).json({
                success: false,
                message: 'Blog ID, author name, email, and content are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(author_email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        const commentData = {
            blog_id: blog_id.trim(),
            author_name: author_name.trim(),
            author_email: author_email.trim().toLowerCase(),
            content: content.trim(),
            status: 'pending' // Comments need admin approval
        };
        
        const newComment = await appwriteService.createComment(commentData);
        
        res.status(201).json({
            success: true,
            data: newComment,
            message: 'Comment submitted successfully. It will be visible after admin approval.'
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create comment',
            error: error.message
        });
    }
});

// Get all comments (admin only)
router.get('/admin/all', async (req, res) => {
    try {
        const { status = 'all', limit = 50, offset = 0 } = req.query;
        
        // This would require admin authentication in production
        // For now, we'll get all comments from the service
        
        const allComments = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.comments,
            [
                ...(status !== 'all' ? [require('appwrite').Query.equal('status', status)] : []),
                require('appwrite').Query.orderDesc('created_at'),
                require('appwrite').Query.limit(parseInt(limit)),
                require('appwrite').Query.offset(parseInt(offset))
            ]
        );
        
        res.status(200).json({
            success: true,
            data: allComments.documents || [],
            total: allComments.total || 0,
            message: 'All comments fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching all comments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comments',
            error: error.message
        });
    }
});

// Update comment status (admin only)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validation
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be: pending, approved, or rejected'
            });
        }
        
        const updatedComment = await appwriteService.db.updateDocument(
            appwriteService.databaseId,
            appwriteService.collections.comments,
            id,
            { status }
        );
        
        res.status(200).json({
            success: true,
            data: updatedComment,
            message: `Comment ${status} successfully`
        });
    } catch (error) {
        console.error('Error updating comment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update comment status',
            error: error.message
        });
    }
});

// Delete comment (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await appwriteService.db.deleteDocument(
            appwriteService.databaseId,
            appwriteService.collections.comments,
            id
        );
        
        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete comment',
            error: error.message
        });
    }
});

// Get comment statistics
router.get('/stats', async (req, res) => {
    try {
        const { Query } = require('node-appwrite');
        
        // Get counts for different statuses
        const pendingComments = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.comments,
            [Query.equal('status', 'pending'), Query.limit(1)]
        );
        
        const approvedComments = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.comments,
            [Query.equal('status', 'approved'), Query.limit(1)]
        );
        
        const rejectedComments = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.comments,
            [Query.equal('status', 'rejected'), Query.limit(1)]
        );
        
        res.status(200).json({
            success: true,
            data: {
                pending: pendingComments.total || 0,
                approved: approvedComments.total || 0,
                rejected: rejectedComments.total || 0,
                total: (pendingComments.total || 0) + (approvedComments.total || 0) + (rejectedComments.total || 0)
            },
            message: 'Comment statistics fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching comment stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comment statistics',
            error: error.message
        });
    }
});

module.exports = router;
