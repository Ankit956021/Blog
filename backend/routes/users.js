const express = require('express');
const router = express.Router();
const appwriteConfig = require('../config/appwrite');

// Get all users (admin only)
router.get('/admin/all', async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        
        const users = await appwriteConfig.users.list([], limit, offset);
        
        res.status(200).json({
            success: true,
            data: users.users || [],
            total: users.total || 0,
            message: 'Users fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Get user by ID (admin only)
router.get('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await appwriteConfig.users.get(id);
        
        res.status(200).json({
            success: true,
            data: user,
            message: 'User fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(404).json({
            success: false,
            message: 'User not found',
            error: error.message
        });
    }
});

// Create user (admin only)
router.post('/admin/create', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }
        
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }
        
        const { ID } = require('node-appwrite');
        
        const newUser = await appwriteConfig.users.create(
            ID.unique(),
            email,
            undefined, // phone (optional)
            password,
            name
        );
        
        res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error.message
        });
    }
});

// Update user (admin only)
router.put('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        
        let updatedUser;
        
        // Update name if provided
        if (name) {
            updatedUser = await appwriteConfig.users.updateName(id, name);
        }
        
        // Update email if provided
        if (email) {
            updatedUser = await appwriteConfig.users.updateEmail(id, email);
        }
        
        if (!name && !email) {
            return res.status(400).json({
                success: false,
                message: 'Name or email is required for update'
            });
        }
        
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message
        });
    }
});

// Delete user (admin only)
router.delete('/admin/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await appwriteConfig.users.delete(id);
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message
        });
    }
});

// Get user statistics
router.get('/stats', async (req, res) => {
    try {
        const users = await appwriteConfig.users.list();
        
        // Calculate basic stats
        const totalUsers = users.total || 0;
        const recentUsers = users.users ? users.users.filter(user => {
            const userDate = new Date(user.$createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return userDate > weekAgo;
        }).length : 0;
        
        res.status(200).json({
            success: true,
            data: {
                total: totalUsers,
                recent: recentUsers,
                active: totalUsers, // For now, consider all users as active
                verified: users.users ? users.users.filter(user => user.emailVerification).length : 0
            },
            message: 'User statistics fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: error.message
        });
    }
});

// Block/Unblock user (admin only)
router.put('/admin/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'blocked' or 'active'
        
        if (!['blocked', 'active'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be either "blocked" or "active"'
            });
        }
        
        const updatedUser = await appwriteConfig.users.updateStatus(id, status === 'blocked');
        
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: `User ${status === 'blocked' ? 'blocked' : 'unblocked'} successfully`
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
});

// Get user sessions (admin only)
router.get('/admin/:id/sessions', async (req, res) => {
    try {
        const { id } = req.params;
        
        const sessions = await appwriteConfig.users.listSessions(id);
        
        res.status(200).json({
            success: true,
            data: sessions.sessions || [],
            total: sessions.total || 0,
            message: 'User sessions fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user sessions',
            error: error.message
        });
    }
});

// Delete user session (admin only)
router.delete('/admin/:userId/sessions/:sessionId', async (req, res) => {
    try {
        const { userId, sessionId } = req.params;
        
        await appwriteConfig.users.deleteSession(userId, sessionId);
        
        res.status(200).json({
            success: true,
            message: 'User session deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user session',
            error: error.message
        });
    }
});

module.exports = router;
