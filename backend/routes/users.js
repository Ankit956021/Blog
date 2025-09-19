const express = require('express');
const router = express.Router();

// Sample users data
let users = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "admin",
        joinDate: "2024-01-01",
        status: "active"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        joinDate: "2024-01-05",
        status: "active"
    }
];

// GET /api/users - Get all users
router.get('/', (req, res) => {
    try {
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// GET /api/users/:id - Get single user
router.get('/:id', (req, res) => {
    try {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', (req, res) => {
    try {
        const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', (req, res) => {
    try {
        const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        users.splice(userIndex, 1);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;
