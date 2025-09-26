// Appwrite Configuration for Frontend
class AppwriteConfig {
    constructor() {
        this.client = new Appwrite.Client();
        this.account = new Appwrite.Account(this.client);
        this.databases = new Appwrite.Databases(this.client);
        this.storage = new Appwrite.Storage(this.client);

        this.init();
    }

    init() {
        this.client
            .setEndpoint(window.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
            .setProject(window.APPWRITE_PROJECT_ID);
    }

    // Database and Collection IDs
    getDatabaseId() {
        return window.APPWRITE_DATABASE_ID || 'blogspot_db';
    }

    getCollectionIds() {
        return {
            blogs: window.APPWRITE_COLLECTION_BLOGS || 'blogs',
            comments: window.APPWRITE_COLLECTION_COMMENTS || 'comments',
            categories: window.APPWRITE_COLLECTION_CATEGORIES || 'categories',
            users: window.APPWRITE_COLLECTION_USERS || 'users',
            support: window.APPWRITE_COLLECTION_SUPPORT || 'support',
            careers: window.APPWRITE_COLLECTION_CAREERS || 'careers'
        };
    }

    getBucketId() {
        return window.APPWRITE_BUCKET_ID || 'blog_images';
    }
}

// Frontend Appwrite Service
class FrontendAppwriteService {
    constructor() {
        this.config = new AppwriteConfig();
        this.db = this.config.databases;
        this.storage = this.config.storage;
        this.account = this.config.account;
        this.databaseId = this.config.getDatabaseId();
        this.collections = this.config.getCollectionIds();
        this.bucketId = this.config.getBucketId();
    }

    // Blog Operations
    async getAllBlogs(limit = 10, offset = 0) {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.blogs,
                [
                    Appwrite.Query.orderDesc('created_at'),
                    Appwrite.Query.limit(limit),
                    Appwrite.Query.offset(offset)
                ]
            );
            return response;
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            throw error;
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
            console.error('Failed to fetch blog:', error);
            throw error;
        }
    }

    async incrementBlogViews(blogId) {
        try {
            const blog = await this.getBlogById(blogId);
            const newViews = (blog.views || 0) + 1;
            
            await this.db.updateDocument(
                this.databaseId,
                this.collections.blogs,
                blogId,
                { views: newViews }
            );
            return newViews;
        } catch (error) {
            console.error('Failed to increment views:', error);
        }
    }

    // Comment Operations
    async createComment(commentData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.comments,
                Appwrite.ID.unique(),
                {
                    blog_id: commentData.blog_id,
                    author_name: commentData.author_name,
                    author_email: commentData.author_email,
                    content: commentData.content,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            );
            return response;
        } catch (error) {
            console.error('Failed to create comment:', error);
            throw error;
        }
    }

    async getCommentsByBlogId(blogId) {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.comments,
                [
                    Appwrite.Query.equal('blog_id', blogId),
                    Appwrite.Query.equal('status', 'approved'),
                    Appwrite.Query.orderDesc('created_at')
                ]
            );
            return response;
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            throw error;
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
            console.error('Failed to fetch categories:', error);
            throw error;
        }
    }

    // Support Operations
    async createSupportTicket(ticketData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.support,
                Appwrite.ID.unique(),
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
            console.error('Failed to create support ticket:', error);
            throw error;
        }
    }

    // Career Operations
    async createCareerApplication(applicationData) {
        try {
            const response = await this.db.createDocument(
                this.databaseId,
                this.collections.careers,
                Appwrite.ID.unique(),
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
            console.error('Failed to create career application:', error);
            throw error;
        }
    }

    // Authentication Operations
    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            return null;
        }
    }

    async loginUser(email, password) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    async logoutUser() {
        try {
            await this.account.deleteSession('current');
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }

    // Search Operations
    async searchBlogs(searchTerm, limit = 10) {
        try {
            const response = await this.db.listDocuments(
                this.databaseId,
                this.collections.blogs,
                [
                    Appwrite.Query.search('title', searchTerm),
                    Appwrite.Query.limit(limit),
                    Appwrite.Query.orderDesc('created_at')
                ]
            );
            return response;
        } catch (error) {
            console.error('Failed to search blogs:', error);
            throw error;
        }
    }
}

// Initialize the service
const appwriteService = new FrontendAppwriteService();
window.appwriteService = appwriteService;