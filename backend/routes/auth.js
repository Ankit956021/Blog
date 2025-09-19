const express = require('express');
const router = express.Router();

// Sample admin credentials (in production, use database and hashing)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// POST /api/auth/login - Admin login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (username === ADMIN_CREDENTIALS.username && 
            password === ADMIN_CREDENTIALS.password) {
            
            // In production, generate JWT token
            const token = 'admin_token_' + Date.now();
            
            res.json({
                success: true,
                token,
                user: {
                    id: 1,
                    username: 'admin',
                    role: 'admin'
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Login error' });
    }
});

// POST /api/auth/logout - Admin logout
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/verify - Verify token
router.get('/verify', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token && token.startsWith('admin_token_')) {
        res.json({ 
            success: true, 
            user: { id: 1, username: 'admin', role: 'admin' }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

module.exports = router;
