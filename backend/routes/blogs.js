const express = require('express');
const router = express.Router();
const appwriteService = require('../services/appwriteService');
const { ID } = require('node-appwrite');

// Get all blogs with pagination
router.get('/', async (req, res) => {
    try {
        const { limit = 10, offset = 0, category, search } = req.query;
        
        let blogs;
        if (search) {
            blogs = await appwriteService.searchBlogs(search, parseInt(limit));
        } else {
            blogs = await appwriteService.getAllBlogs(parseInt(limit), parseInt(offset));
        }
        
        // Filter by category if provided
        if (category && blogs.documents) {
            blogs.documents = blogs.documents.filter(blog => 
                blog.category.toLowerCase() === category.toLowerCase()
            );
        }
        
        res.status(200).json({
            success: true,
            data: blogs.documents || [],
            total: blogs.total || 0,
            message: 'Blogs fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
            error: error.message
        });
    }
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await appwriteService.getBlogById(id);
        
        res.status(200).json({
            success: true,
            data: blog,
            message: 'Blog fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(404).json({
            success: false,
            message: 'Blog not found',
            error: error.message
        });
    }
});

// Create new blog
router.post('/', async (req, res) => {
    try {
        const { title, content, excerpt, author, category, tags, featured_image, status } = req.body;
        
        // Validation
        if (!title || !content || !author || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, author, and category are required'
            });
        }
        
        const blogData = {
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt ? excerpt.trim() : content.substring(0, 200) + '...',
            author: author.trim(),
            category: category.trim(),
            tags: tags || [],
            featured_image: featured_image || null,
            status: status || 'published'
        };
        
        const newBlog = await appwriteService.createBlog(blogData);
        
        res.status(201).json({
            success: true,
            data: newBlog,
            message: 'Blog created successfully'
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create blog',
            error: error.message
        });
    }
});

// Update blog
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        
        const updatedBlog = await appwriteService.updateBlog(id, updateData);
        
        res.status(200).json({
            success: true,
            data: updatedBlog,
            message: 'Blog updated successfully'
        });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update blog',
            error: error.message
        });
    }
});

// Delete blog
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await appwriteService.deleteBlog(id);
        
        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog',
            error: error.message
        });
    }
});

// Increment blog views
router.post('/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await appwriteService.getBlogById(id);
        const newViews = (blog.views || 0) + 1;
        
        await appwriteService.updateBlog(id, { views: newViews });
        
        res.status(200).json({
            success: true,
            data: { views: newViews },
            message: 'Blog view incremented'
        });
    } catch (error) {
        console.error('Error incrementing views:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to increment views',
            error: error.message
        });
    }
});

// Like/Unlike blog
router.post('/:id/like', async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'like' or 'unlike'
        
        const blog = await appwriteService.getBlogById(id);
        let newLikes = blog.likes || 0;
        
        if (action === 'like') {
            newLikes += 1;
        } else if (action === 'unlike' && newLikes > 0) {
            newLikes -= 1;
        }
        
        await appwriteService.updateBlog(id, { likes: newLikes });
        
        res.status(200).json({
            success: true,
            data: { likes: newLikes },
            message: `Blog ${action}d successfully`
        });
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update likes',
            error: error.message
        });
    }
});

// Get blogs by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 10, offset = 0 } = req.query;
        
        const blogs = await appwriteService.getAllBlogs(parseInt(limit), parseInt(offset));
        
        // Filter by category
        const filteredBlogs = blogs.documents.filter(blog => 
            blog.category.toLowerCase() === category.toLowerCase()
        );
        
        res.status(200).json({
            success: true,
            data: filteredBlogs,
            total: filteredBlogs.length,
            message: `Blogs in category '${category}' fetched successfully`
        });
    } catch (error) {
        console.error('Error fetching blogs by category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs by category',
            error: error.message
        });
    }
});

module.exports = router;
