const express = require('express');
const router = express.Router();

// Sample data for demonstration
let blogs = [
    {
        id: 1,
        title: "Getting Started with Web Development",
        content: "Web development is an exciting field...",
        author: "John Doe",
        date: "2024-01-15",
        image: "https://via.placeholder.com/400x250",
        category: "Technology",
        status: "published"
    },
    {
        id: 2,
        title: "The Future of AI",
        content: "Artificial Intelligence is changing the world...",
        author: "Jane Smith",
        date: "2024-01-10",
        image: "https://via.placeholder.com/400x250",
        category: "AI",
        status: "published"
    }
];

// GET /api/blogs - Get all blogs
router.get('/', (req, res) => {
    try {
        const publishedBlogs = blogs.filter(blog => blog.status === 'published');
        res.json(publishedBlogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// GET /api/blogs/:id - Get single blog
router.get('/:id', (req, res) => {
    try {
        const blog = blogs.find(b => b.id === parseInt(req.params.id));
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog' });
    }
});

// POST /api/blogs - Create new blog
router.post('/', (req, res) => {
    try {
        const { title, content, author, category, image } = req.body;
        
        const newBlog = {
            id: blogs.length + 1,
            title,
            content,
            author,
            category,
            image: image || "https://via.placeholder.com/400x250",
            date: new Date().toISOString().split('T')[0],
            status: 'published'
        };
        
        blogs.push(newBlog);
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog' });
    }
});

// PUT /api/blogs/:id - Update blog
router.put('/:id', (req, res) => {
    try {
        const blogIndex = blogs.findIndex(b => b.id === parseInt(req.params.id));
        if (blogIndex === -1) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        blogs[blogIndex] = { ...blogs[blogIndex], ...req.body };
        res.json(blogs[blogIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog' });
    }
});

// DELETE /api/blogs/:id - Delete blog
router.delete('/:id', (req, res) => {
    try {
        const blogIndex = blogs.findIndex(b => b.id === parseInt(req.params.id));
        if (blogIndex === -1) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        blogs.splice(blogIndex, 1);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog' });
    }
});

module.exports = router;
