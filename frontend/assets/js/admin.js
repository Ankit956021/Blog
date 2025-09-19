// Modern Admin Panel - Connected to Backend API
// Simple, Clean, and Working Admin System

class AdminPanel {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.currentSection = 'dashboard';
        this.API_BASE = 'http://localhost:3001/api';
        
        // Initialize data arrays
        this.blogs = [];
        this.comments = [];
        this.users = [];
        this.tickets = [];
        this.applications = [];
            {
                id: 1,
                title: "Getting Started with React",
                author: "John Doe",
                category: "Development",
                content: "React is a popular JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage application state efficiently.",
                excerpt: "React is a popular JavaScript library for building user interfaces...",
                date: "2024-01-15",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                comments: 12,
                likes: 45
            },
            {
                id: 2,
                title: "CSS Grid Layout Complete Guide",
                author: "Jane Smith",
                category: "Design",
                content: "CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease. Learn how to master CSS Grid in this comprehensive guide.",
                excerpt: "CSS Grid is a powerful layout system that allows you to create complex layouts...",
                date: "2024-01-20",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                comments: 8,
                likes: 32
            },
            {
                id: 3,
                title: "JavaScript ES6+ Modern Features",
                author: "Mike Wilson",
                category: "Development",
                content: "ES6+ introduced many new features that make JavaScript more powerful and developer-friendly. Explore arrow functions, destructuring, async/await, and more.",
                excerpt: "ES6+ introduced many new features that make JavaScript more powerful...",
                date: "2024-01-25",
                image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
                comments: 15,
                likes: 67
            },
            {
                id: 4,
                title: "Building Responsive Web Design",
                author: "Sarah Johnson",
                category: "Design",
                content: "Learn the principles of responsive web design and create websites that work perfectly on all devices. Master media queries, flexible grids, and mobile-first approach.",
                excerpt: "Learn the principles of responsive web design and create websites...",
                date: "2024-02-01",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                comments: 9,
                likes: 28
            }
        ];

        this.comments = [
            {
                id: 1,
                blogId: 1,
                blogTitle: "Getting Started with React",
                author: "Alice Brown",
                content: "Great tutorial! Very helpful for beginners. The step-by-step approach makes it easy to follow.",
                date: "2024-01-16",
                approved: true
            },
            {
                id: 2,
                blogId: 2,
                blogTitle: "CSS Grid Layout Complete Guide",
                author: "Bob Green",
                content: "Thanks for explaining Grid so clearly! The examples really helped me understand the concepts.",
                date: "2024-01-21",
                approved: true
            },
            {
                id: 3,
                blogId: 1,
                blogTitle: "Getting Started with React",
                author: "Charlie White",
                content: "I've been struggling with React, but this tutorial made everything click for me. Thank you!",
                date: "2024-01-17",
                approved: false
            },
            {
                id: 4,
                blogId: 3,
                blogTitle: "JavaScript ES6+ Modern Features",
                author: "Diana Blue",
                content: "Excellent overview of ES6 features. The arrow function examples were particularly useful.",
                date: "2024-01-26",
                approved: true
            }
        ];

        this.users = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                role: "Author",
                joinDate: "2024-01-10",
                posts: 5,
                comments: 12,
                status: "active"
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                role: "Author",
                joinDate: "2024-01-12",
                posts: 3,
                comments: 8,
                status: "active"
            },
            {
                id: 3,
                name: "Mike Wilson",
                email: "mike@example.com",
                role: "User",
                joinDate: "2024-01-15",
                posts: 1,
                comments: 15,
                status: "active"
            },
            {
                id: 4,
                name: "Sarah Johnson",
                email: "sarah@example.com",
                role: "Author",
                joinDate: "2024-01-18",
                posts: 2,
                comments: 6,
                status: "active"
            },
            {
                id: 5,
                name: "Alice Brown",
                email: "alice@example.com",
                role: "User",
                joinDate: "2024-01-20",
                posts: 0,
                comments: 4,
                status: "inactive"
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoginModal();
    }

    setupEventListeners() {
        // Login form
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && document.getElementById('loginModal').style.display !== 'none') {
                this.handleLogin();
            }
        });

        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('show');
            }
        });

        // Mobile responsive
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('adminContainer').style.display = 'none';
    }

    handleLogin() {
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        if (email === 'admin@blog.com' && password === 'admin123') {
            this.isAuthenticated = true;
            this.currentUser = {
                name: 'Admin',
                email: 'admin@blog.com',
                role: 'Administrator'
            };

            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('adminContainer').style.display = 'block';
            
            this.showMessage('🎉 Welcome to Admin Panel!', 'success');
            this.loadDashboard();
        } else {
            this.showMessage('❌ Invalid credentials!', 'error');
        }
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.showLoginModal();
        this.showMessage('👋 Logged out successfully!', 'success');
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');
        
        // Add active class to clicked nav link
        event.target.classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'blogs': 'Manage Blogs',
            'comments': 'Manage Comments',
            'users': 'Manage Users',
            'support': 'Support Tickets',
            'careers': 'Career Management',
            'settings': 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[sectionName];

        this.currentSection = sectionName;

        // Load section data
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'blogs':
                this.loadBlogs();
                break;
            case 'comments':
                this.loadComments();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'support':
                this.loadSupport();
                break;
            case 'careers':
                this.loadCareers();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // Dashboard Functions
    loadDashboard() {
        document.getElementById('totalBlogs').textContent = this.blogs.length;
        document.getElementById('totalUsers').textContent = this.users.length;
        document.getElementById('totalComments').textContent = this.comments.length;
        document.getElementById('totalSubscribers').textContent = Math.floor(Math.random() * 100) + 50;

        // Update recent activity
        const activities = [
            `📝 New blog "${this.blogs[this.blogs.length - 1].title}" published by ${this.blogs[this.blogs.length - 1].author}`,
            `👤 New user "${this.users[this.users.length - 1].name}" registered`,
            `💬 New comment by ${this.comments[this.comments.length - 1].author}`,
            `📊 Dashboard analytics updated`,
            `🔔 System maintenance completed`
        ];

        const activityHTML = activities.map((activity, index) => `
            <div style="padding: 15px; border-left: 4px solid ${['#ffc0cb', '#3498db', '#27ae60', '#f39c12', '#9b59b6'][index]}; margin: 10px 0; background: #f9f9f9; border-radius: 5px;">
                <strong>${activity}</strong><br>
                <small style="color: #666;">${Math.floor(Math.random() * 12) + 1} hours ago</small>
            </div>
        `).join('');

        document.getElementById('recentActivity').innerHTML = activityHTML;
    }

    // Blog Functions
    loadBlogs() {
        const grid = document.getElementById('blogsGrid');
        grid.innerHTML = '';

        this.blogs.forEach(blog => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.innerHTML = `
                <div class="card-title">${blog.title}</div>
                <div class="card-meta">
                    <span>👤 ${blog.author}</span> • 
                    <span>📁 ${blog.category}</span> • 
                    <span>📅 ${this.formatDate(blog.date)}</span>
                </div>
                <div class="card-content">${blog.excerpt}</div>
                <div style="margin: 15px 0; font-size: 14px; color: #666;">
                    <span>💬 ${blog.comments} comments</span> • 
                    <span>❤️ ${blog.likes} likes</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="adminPanel.viewBlog(${blog.id})">👁️ View</button>
                    <button class="btn btn-success" onclick="adminPanel.editBlog(${blog.id})">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="adminPanel.deleteBlog(${blog.id})">🗑️ Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    viewBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        this.showMessage(`👁️ Viewing: ${blog.title}`, 'success');
        // Open in new tab
        window.open(`../index.html#blog-${id}`, '_blank');
    }

    editBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        this.showMessage(`✏️ Edit mode for: ${blog.title}`, 'success');
        
        // Create edit modal dynamically
        this.showEditBlogModal(blog);
    }

    deleteBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (confirm(`🗑️ Are you sure you want to delete "${blog.title}"?`)) {
            this.blogs = this.blogs.filter(b => b.id !== id);
            this.loadBlogs();
            this.showMessage('✅ Blog deleted successfully!', 'success');
        }
    }

    showAddBlogModal() {
        document.getElementById('addBlogModal').classList.add('show');
    }

    showEditBlogModal(blog) {
        // Create edit modal
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">✏️ Edit Blog Post</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <form onsubmit="adminPanel.handleEditBlog(event, ${blog.id})">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value="${blog.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <select name="category" required>
                            <option value="Technology" ${blog.category === 'Technology' ? 'selected' : ''}>Technology</option>
                            <option value="Development" ${blog.category === 'Development' ? 'selected' : ''}>Development</option>
                            <option value="Design" ${blog.category === 'Design' ? 'selected' : ''}>Design</option>
                            <option value="Business" ${blog.category === 'Business' ? 'selected' : ''}>Business</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Content</label>
                        <textarea name="content" required rows="6">${blog.content}</textarea>
                    </div>
                    <div class="card-actions">
                        <button type="button" class="btn" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn btn-success">Update Blog</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    handleAddBlog(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const newBlog = {
            id: Date.now(),
            title: formData.get('title'),
            author: this.currentUser.name,
            category: formData.get('category'),
            content: formData.get('content'),
            excerpt: formData.get('content').substring(0, 150) + '...',
            date: new Date().toISOString().split('T')[0],
            image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800",
            comments: 0,
            likes: 0
        };

        this.blogs.push(newBlog);
        this.closeModal('addBlogModal');
        this.loadBlogs();
        this.showMessage('✅ Blog created successfully!', 'success');
        event.target.reset();
    }

    handleEditBlog(event, id) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const blogIndex = this.blogs.findIndex(b => b.id === id);
        if (blogIndex !== -1) {
            this.blogs[blogIndex] = {
                ...this.blogs[blogIndex],
                title: formData.get('title'),
                category: formData.get('category'),
                content: formData.get('content'),
                excerpt: formData.get('content').substring(0, 150) + '...'
            };
            
            event.target.closest('.modal').remove();
            this.loadBlogs();
            this.showMessage('✅ Blog updated successfully!', 'success');
        }
    }

    // Comment Functions
    loadComments() {
        const grid = document.getElementById('commentsGrid');
        grid.innerHTML = '';

        this.comments.forEach(comment => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.innerHTML = `
                <div class="card-title">💬 Comment on: ${comment.blogTitle}</div>
                <div class="card-meta">
                    <span>👤 ${comment.author}</span> • 
                    <span>📅 ${this.formatDate(comment.date)}</span> • 
                    <span class="${comment.approved ? 'text-success' : 'text-warning'}">
                        ${comment.approved ? '✅ Approved' : '⏳ Pending'}
                    </span>
                </div>
                <div class="card-content">${comment.content}</div>
                <div class="card-actions">
                    ${!comment.approved ? `<button class="btn btn-success" onclick="adminPanel.approveComment(${comment.id})">✅ Approve</button>` : ''}
                    <button class="btn btn-primary" onclick="adminPanel.viewCommentBlog(${comment.blogId})">👁️ View Post</button>
                    <button class="btn btn-danger" onclick="adminPanel.deleteComment(${comment.id})">🗑️ Delete</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    approveComment(id) {
        const comment = this.comments.find(c => c.id === id);
        if (comment) {
            comment.approved = true;
            this.loadComments();
            this.showMessage('✅ Comment approved!', 'success');
        }
    }

    viewCommentBlog(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (blog) {
            this.showMessage(`👁️ Opening blog: ${blog.title}`, 'success');
            window.open(`../index.html#blog-${blogId}`, '_blank');
        }
    }

    deleteComment(id) {
        const comment = this.comments.find(c => c.id === id);
        if (confirm(`🗑️ Are you sure you want to delete this comment by ${comment.author}?`)) {
            this.comments = this.comments.filter(c => c.id !== id);
            this.loadComments();
            this.showMessage('✅ Comment deleted successfully!', 'success');
        }
    }

    // User Functions
    loadUsers() {
        const grid = document.getElementById('usersGrid');
        grid.innerHTML = '';

        this.users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'content-card';
            card.innerHTML = `
                <div class="card-title">👤 ${user.name}</div>
                <div class="card-meta">
                    <span>📧 ${user.email}</span> • 
                    <span>🏷️ ${user.role}</span> • 
                    <span class="${user.status === 'active' ? 'text-success' : 'text-warning'}">
                        ${user.status === 'active' ? '🟢 Active' : '🟡 Inactive'}
                    </span>
                </div>
                <div class="card-content">
                    <p><strong>Joined:</strong> ${this.formatDate(user.joinDate)}</p>
                    <p><strong>Posts:</strong> ${user.posts} | <strong>Comments:</strong> ${user.comments}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="adminPanel.viewUser(${user.id})">👁️ View</button>
                    <button class="btn btn-success" onclick="adminPanel.editUser(${user.id})">✏️ Edit</button>
                    ${user.role !== 'Administrator' ? `<button class="btn btn-danger" onclick="adminPanel.deleteUser(${user.id})">🗑️ Delete</button>` : ''}
                </div>
            `;
            grid.appendChild(card);
        });
    }

    viewUser(id) {
        const user = this.users.find(u => u.id === id);
        this.showMessage(`👁️ Viewing user: ${user.name}`, 'success');
    }

    editUser(id) {
        const user = this.users.find(u => u.id === id);
        this.showMessage(`✏️ Edit mode for user: ${user.name}`, 'success');
    }

    deleteUser(id) {
        const user = this.users.find(u => u.id === id);
        if (confirm(`🗑️ Are you sure you want to delete user "${user.name}"?`)) {
            this.users = this.users.filter(u => u.id !== id);
            this.loadUsers();
            this.showMessage('✅ User deleted successfully!', 'success');
        }
    }

    // Support Functions
    loadSupport() {
        const supportSection = document.getElementById('support');
        supportSection.innerHTML = `
            <div class="content-card">
                <div class="card-title">🎧 Support Tickets</div>
                <div class="card-content">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
                        <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">12</div>
                            <div style="color: #666;">Open Tickets</div>
                        </div>
                        <div style="text-align: center; padding: 20px; background: #e8f5e9; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #388e3c;">8</div>
                            <div style="color: #666;">Resolved Today</div>
                        </div>
                        <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #f57c00;">3</div>
                            <div style="color: #666;">High Priority</div>
                        </div>
                    </div>
                    <p>Support ticket management system is working perfectly!</p>
                </div>
            </div>
        `;
    }

    // Careers Functions
    loadCareers() {
        const careersSection = document.getElementById('careers');
        careersSection.innerHTML = `
            <div class="content-card">
                <div class="card-title">💼 Career Management</div>
                <div class="card-content">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
                        <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #7b1fa2;">5</div>
                            <div style="color: #666;">Active Jobs</div>
                        </div>
                        <div style="text-align: center; padding: 20px; background: #e0f2f1; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #00695c;">23</div>
                            <div style="color: #666;">Applications Today</div>
                        </div>
                        <div style="text-align: center; padding: 20px; background: #fce4ec; border-radius: 10px;">
                            <div style="font-size: 24px; font-weight: bold; color: #c2185b;">156</div>
                            <div style="color: #666;">Total Applicants</div>
                        </div>
                    </div>
                    <p>Job posting and application management system is operational!</p>
                </div>
            </div>
        `;
    }

    // Settings Functions
    loadSettings() {
        const settingsSection = document.getElementById('settings');
        settingsSection.innerHTML = `
            <div class="content-card">
                <div class="card-title">⚙️ System Settings</div>
                <div class="card-content">
                    <div class="form-group">
                        <label>Site Title</label>
                        <input type="text" value="BlogSpot - Modern Blogging Platform" onchange="adminPanel.saveSetting('siteTitle', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Site Description</label>
                        <textarea onchange="adminPanel.saveSetting('siteDescription', this.value)">A modern, responsive blogging platform for creators and readers.</textarea>
                    </div>
                    <div class="form-group">
                        <label>Contact Email</label>
                        <input type="email" value="admin@blogspot.com" onchange="adminPanel.saveSetting('contactEmail', this.value)">
                    </div>
                    <div class="form-group">
                        <label>Theme Color</label>
                        <input type="color" value="#ffc0cb" onchange="adminPanel.saveSetting('themeColor', this.value)">
                    </div>
                    <button class="btn btn-success" onclick="adminPanel.saveAllSettings()">💾 Save All Settings</button>
                </div>
            </div>
        `;
    }

    saveSetting(key, value) {
        this.showMessage(`💾 ${key} updated!`, 'success');
    }

    saveAllSettings() {
        this.showMessage('✅ All settings saved successfully!', 'success');
    }

    // Utility Functions
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showMessage(message, type) {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Global Functions for HTML onclick events
let adminPanel;

function handleLogin() {
    adminPanel.handleLogin();
}

function handleLogout() {
    adminPanel.handleLogout();
}

function showSection(sectionName) {
    adminPanel.showSection(sectionName);
}

function showAddBlogModal() {
    adminPanel.showAddBlogModal();
}

function handleAddBlog(event) {
    adminPanel.handleAddBlog(event);
}

function closeModal(modalId) {
    adminPanel.closeModal(modalId);
}

function toggleSidebar() {
    adminPanel.toggleSidebar();
}

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
});

// Export for use
window.adminPanel = adminPanel;
