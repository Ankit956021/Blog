const appwrite = require('../config/appwrite');
const { ID, Query } = require('node-appwrite');

class AppwriteService {
    constructor() {
        this.db = appwrite.databases;
        this.storage = appwrite.storage;
        this.users = appwrite.users;
        this.databaseId = appwrite.getDatabaseId();
        this.collections = appwrite.getCollectionIds();
        this.bucketId = appwrite.getBucketId();
    }

    // Blog Operations
    async createBlog(blogData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.blogs,
                ID.unique(),
                {
                    title: blogData.title,
                    content: blogData.content,
                    excerpt: blogData.excerpt,
                    author: blogData.author,
                    category: blogData.category,
                    tags: blogData.tags || [],
                    featured_image: blogData.featured_image || null,
                    status: blogData.status || 'published',
                    views: 0,
                    likes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to create blog: ${error.message}`);
        }
    }

    async getAllBlogs(limit = 10, offset = 0) {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.blogs,
                [
                    Query.orderDesc('created_at'),
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch blogs: ${error.message}`);
        }
    }

    async getBlogById(blogId) {
        try {
            const response = await this.db.getDocument(
                this.databaseId,
                this.collections.blogs,
                blogId
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch blog: ${error.message}`);
        }
    }

    async updateBlog(blogId, updateData) {
        try {
            const response = await this.db.updateDocument(
                this.databaseId,
                this.collections.blogs,
                blogId,
                {
                    ...updateData,
                    updated_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to update blog: ${error.message}`);
        }
    }

    async deleteBlog(blogId) {
        try {
            await this.db.deleteDocument(
                this.databaseId,
                this.collections.blogs,
                blogId
            );
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to delete blog: ${error.message}`);
        }
    }

    // Comment Operations
    async createComment(commentData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.comments,
                ID.unique(),
                {
                    blog_id: commentData.blog_id,
                    author_name: commentData.author_name,
                    author_email: commentData.author_email,
                    content: commentData.content,
                    status: commentData.status || 'pending',
                    created_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to create comment: ${error.message}`);
        }
    }

    async getCommentsByBlogId(blogId) {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.comments,
                [
                    Query.equal('blog_id', blogId),
                    Query.equal('status', 'approved'),
                    Query.orderDesc('created_at')
                ]
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch comments: ${error.message}`);
        }
    }

    // Category Operations
    async getAllCategories() {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.categories
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to fetch categories: ${error.message}`);
        }
    }

    async createCategory(categoryData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.categories,
                ID.unique(),
                {
                    name: categoryData.name,
                    description: categoryData.description,
                    slug: categoryData.slug,
                    created_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to create category: ${error.message}`);
        }
    }

    // Support Operations
    async createSupportTicket(ticketData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.support,
                ID.unique(),
                {
                    name: ticketData.name,
                    email: ticketData.email,
                    subject: ticketData.subject,
                    message: ticketData.message,
                    status: 'open',
                    priority: ticketData.priority || 'medium',
                    created_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to create support ticket: ${error.message}`);
        }
    }

    // Career Operations
    async createCareerApplication(applicationData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.careers,
                ID.unique(),
                {
                    name: applicationData.name,
                    email: applicationData.email,
                    phone: applicationData.phone,
                    position: applicationData.position,
                    experience: applicationData.experience,
                    skills: applicationData.skills,
                    cover_letter: applicationData.cover_letter,
                    resume_url: applicationData.resume_url || null,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to create career application: ${error.message}`);
        }
    }

    // File Upload Operations
    async uploadFile(file) {
        try {
            const response = await this.storage.createFile(
                this.bucketId,
                ID.unique(),
                file
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }
    }

    async getFilePreview(fileId, width = 400, height = 400) {
        try {
            const response = this.storage.getFilePreview(
                this.bucketId,
                fileId,
                width,
                height
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to get file preview: ${error.message}`);
        }
    }

    // Search Operations
    async searchBlogs(searchTerm, limit = 10) {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.blogs,
                [
                    Query.search('title', searchTerm),
                    Query.limit(limit),
                    Query.orderDesc('created_at')
                ]
            );
            return response;
        } catch (error) {
            throw new Error(`Failed to search blogs: ${error.message}`);
        }
    }
}

module.exports = new AppwriteService();