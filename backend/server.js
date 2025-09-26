const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Appwrite configuration to initialize
const appwriteConfig = require('./config/appwrite');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Appwrite connection
app.get('/api/health', async (req, res) => {
    try {
        // Test Appwrite connection
        const databases = appwriteConfig.databases;
        const databaseId = appwriteConfig.getDatabaseId();
        
        // Try to list collections to test connection
        await databases.list();
        
        res.status(200).json({
            success: true,
            message: 'Server is running and Appwrite is connected',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            appwrite: {
                endpoint: process.env.APPWRITE_ENDPOINT,
                project: process.env.APPWRITE_PROJECT_ID,
                database: databaseId
            }
        });
    } catch (error) {
        console.error('Appwrite connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Server is running but Appwrite connection failed',
            error: error.message
        });
    }
});

// API Routes
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/support', require('./routes/support'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Categories route (simple implementation)
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await appwriteConfig.databases.listDocuments(
            appwriteConfig.getDatabaseId(),
            appwriteConfig.getCollectionIds().categories
        );
        
        res.status(200).json({
            success: true,
            data: categories.documents || [],
            message: 'Categories fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// Create category (admin only)
app.post('/api/categories', async (req, res) => {
    try {
        const { name, description, slug } = req.body;
        
        if (!name || !slug) {
            return res.status(400).json({
                success: false,
                message: 'Name and slug are required'
            });
        }
        
        const { ID } = require('node-appwrite');
        const newCategory = await appwriteConfig.databases.createDocument(
            appwriteConfig.getDatabaseId(),
            appwriteConfig.getCollectionIds().categories,
            ID.unique(),
            {
                name: name.trim(),
                description: description ? description.trim() : '',
                slug: slug.trim().toLowerCase(),
                created_at: new Date().toISOString()
            }
        );
        
        res.status(201).json({
            success: true,
            data: newCategory,
            message: 'Category created successfully'
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
});

// Default route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'BlogSpot API Server is running!',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            blogs: '/api/blogs',
            comments: '/api/comments',
            categories: '/api/categories',
            support: '/api/support',
            careers: '/api/careers',
            auth: '/api/auth',
            users: '/api/users'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 BlogSpot API Server is running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⚡ Appwrite Project: ${process.env.APPWRITE_PROJECT_ID}`);
    console.log(`🗄️ Database: ${process.env.APPWRITE_DATABASE_ID}`);
});

module.exports = app;
