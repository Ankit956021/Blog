const express = require('express');
const router = express.Router();
const appwriteConfig = require('../config/appwrite');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        
        // Create session
        const session = await appwriteConfig.account.createEmailPasswordSession(email, password);
        
        res.status(200).json({
            success: true,
            data: session,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid credentials',
            error: error.message
        });
    }
});

// Register route
router.post('/register', async (req, res) => {
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
        
        // Create user account
        const user = await appwriteConfig.account.create(
            ID.unique(),
            email,
            password,
            name
        );
        
        res.status(201).json({
            success: true,
            data: user,
            message: 'Account created successfully. Please login to continue.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    try {
        // Delete current session
        await appwriteConfig.account.deleteSession('current');
        
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const user = await appwriteConfig.account.get();
        
        res.status(200).json({
            success: true,
            data: user,
            message: 'User data fetched successfully'
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authenticated',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }
        
        const updatedUser = await appwriteConfig.account.updateName(name);
        
        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Change password
router.put('/password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old password and new password are required'
            });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }
        
        await appwriteConfig.account.updatePassword(newPassword, oldPassword);
        
        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
});

// Send password recovery email
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        
        // Note: You'll need to configure recovery URL in Appwrite console
        const recoveryUrl = 'http://localhost:3000/reset-password';
        
        await appwriteConfig.account.createRecovery(email, recoveryUrl);
        
        res.status(200).json({
            success: true,
            message: 'Password recovery email sent successfully'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send recovery email',
            error: error.message
        });
    }
});

// Reset password with recovery token
router.post('/reset-password', async (req, res) => {
    try {
        const { userId, secret, password } = req.body;
        
        if (!userId || !secret || !password) {
            return res.status(400).json({
                success: false,
                message: 'User ID, secret, and new password are required'
            });
        }
        
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }
        
        await appwriteConfig.account.updateRecovery(userId, secret, password);
        
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(400).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
});

module.exports = router;
