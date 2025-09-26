const { Client, Account, Databases, Storage, Teams, Users } = require('node-appwrite');

class AppwriteConfig {
    constructor() {
        this.client = new Client();
        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
        this.teams = new Teams(this.client);
        this.users = new Users(this.client);

        this.init();
    }

    init() {
        this.client
            .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setKey(process.env.APPWRITE_API_KEY);
    }

    // Database and Collection IDs
    getDatabaseId() {
        return process.env.APPWRITE_DATABASE_ID || 'blogspot_db';
    }

    getCollectionIds() {
        return {
            blogs: process.env.APPWRITE_COLLECTION_BLOGS || 'blogs',
            comments: process.env.APPWRITE_COLLECTION_COMMENTS || 'comments',
            categories: process.env.APPWRITE_COLLECTION_CATEGORIES || 'categories',
            users: process.env.APPWRITE_COLLECTION_USERS || 'users',
            support: process.env.APPWRITE_COLLECTION_SUPPORT || 'support',
            careers: process.env.APPWRITE_COLLECTION_CAREERS || 'careers'
        };
    }

    getBucketId() {
        return process.env.APPWRITE_BUCKET_ID || 'blog_images';
    }
}

module.exports = new AppwriteConfig();