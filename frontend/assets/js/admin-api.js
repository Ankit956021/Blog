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
        
        this.init();
    }

    // API Helper Methods
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            if (data) {
                config.body = JSON.stringify(data);
            }
            
            if (this.currentUser?.token) {
                config.headers.Authorization = `Bearer ${this.currentUser.token}`;
            }
            
            const response = await fetch(`${this.API_BASE}${endpoint}`, config);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API call failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            this.showMessage(error.message, 'error');
            throw error;
        }
    }

    // Load data from API
    async loadBlogs() {
        try {
            this.blogs = await this.apiCall('/blogs');
            this.renderBlogs();
        } catch (error) {
            console.error('Failed to load blogs:', error);
        }
    }

    async loadComments() {
        try {
            this.comments = await this.apiCall('/comments');
            this.renderComments();
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    }

    async loadUsers() {
        try {
            this.users = await this.apiCall('/users');
            this.renderUsers();
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.showLoginModal();
    }

    checkAuth() {
        const token = localStorage.getItem('adminToken');
        const user = localStorage.getItem('adminUser');
        
        if (token && user) {
            this.currentUser = JSON.parse(user);
            this.currentUser.token = token;
            this.isAuthenticated = true;
            this.showDashboard();
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => this.toggleMobileMenu());
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showMessage('Please enter both username and password', 'error');
            return;
        }
        
        try {
            const result = await this.apiCall('/auth/login', 'POST', { username, password });
            
            if (result.success) {
                this.currentUser = result.user;
                this.currentUser.token = result.token;
                this.isAuthenticated = true;
                
                // Store in localStorage
                localStorage.setItem('adminToken', result.token);
                localStorage.setItem('adminUser', JSON.stringify(result.user));
                
                this.showMessage('Login successful!', 'success');
                this.showDashboard();
            }
        } catch (error) {
            this.showMessage('Invalid credentials', 'error');
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        this.showLoginModal();
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('adminContainer').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'flex';
        this.showSection('dashboard');
        this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            // Load all data for dashboard
            await Promise.all([
                this.loadBlogs(),
                this.loadComments(),
                this.loadUsers()
            ]);
            
            this.updateDashboardStats();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    updateDashboardStats() {
        // Update dashboard statistics
        document.getElementById('totalBlogs').textContent = this.blogs.length;
        document.getElementById('totalComments').textContent = this.comments.length;
        document.getElementById('totalUsers').textContent = this.users.length;
        document.getElementById('pendingComments').textContent = 
            this.comments.filter(c => c.status === 'pending').length;
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        this.showSection(section);
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(s => {
            s.style.display = 'none';
        });
        
        // Remove active class from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected section
        const sectionElement = document.getElementById(`${section}Section`);
        if (sectionElement) {
            sectionElement.style.display = 'block';
        }
        
        // Add active class to current nav item
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        this.currentSection = section;
        
        // Load section data
        this.loadSectionData(section);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'blogs':
                await this.loadBlogs();
                break;
            case 'comments':
                await this.loadComments();
                break;
            case 'users':
                await this.loadUsers();
                break;
            case 'dashboard':
                await this.loadDashboardData();
                break;
        }
    }

    renderBlogs() {
        const container = document.getElementById('blogsContainer');
        if (!container) return;
        
        container.innerHTML = this.blogs.map(blog => `
            <div class="blog-card">
                <div class="blog-image">
                    <img src="${blog.image || 'https://via.placeholder.com/300x200'}" alt="${blog.title}">
                </div>
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p class="blog-meta">By ${blog.author} • ${blog.date}</p>
                    <p class="blog-category">${blog.category}</p>
                    <div class="blog-actions">
                        <button onclick="adminPanel.editBlog(${blog.id})" class="btn btn-edit">Edit</button>
                        <button onclick="adminPanel.deleteBlog(${blog.id})" class="btn btn-delete">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderComments() {
        const container = document.getElementById('commentsContainer');
        if (!container) return;
        
        container.innerHTML = this.comments.map(comment => `
            <div class="comment-card ${comment.status}">
                <div class="comment-header">
                    <strong>${comment.author}</strong>
                    <span class="comment-date">${comment.date}</span>
                    <span class="comment-status status-${comment.status}">${comment.status}</span>
                </div>
                <p class="comment-content">${comment.content}</p>
                <div class="comment-actions">
                    ${comment.status === 'pending' ? 
                        `<button onclick="adminPanel.approveComment(${comment.id})" class="btn btn-approve">Approve</button>` : 
                        ''
                    }
                    <button onclick="adminPanel.deleteComment(${comment.id})" class="btn btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    }

    renderUsers() {
        const container = document.getElementById('usersContainer');
        if (!container) return;
        
        container.innerHTML = this.users.map(user => `
            <div class="user-card">
                <div class="user-avatar">
                    <img src="https://via.placeholder.com/50x50" alt="${user.name}">
                </div>
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                    <span class="user-role">${user.role}</span>
                    <span class="user-status">${user.status}</span>
                </div>
                <div class="user-actions">
                    <button onclick="adminPanel.editUser(${user.id})" class="btn btn-edit">Edit</button>
                    <button onclick="adminPanel.deleteUser(${user.id})" class="btn btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // CRUD Operations
    async createBlog(blogData) {
        try {
            const newBlog = await this.apiCall('/blogs', 'POST', blogData);
            this.showMessage('Blog created successfully!', 'success');
            await this.loadBlogs();
            return newBlog;
        } catch (error) {
            this.showMessage('Failed to create blog', 'error');
        }
    }

    async editBlog(id) {
        const blog = this.blogs.find(b => b.id === id);
        if (!blog) return;
        
        // Show edit modal with blog data
        this.showBlogModal(blog);
    }

    async deleteBlog(id) {
        if (!confirm('Are you sure you want to delete this blog?')) return;
        
        try {
            await this.apiCall(`/blogs/${id}`, 'DELETE');
            this.showMessage('Blog deleted successfully!', 'success');
            await this.loadBlogs();
        } catch (error) {
            this.showMessage('Failed to delete blog', 'error');
        }
    }

    async approveComment(id) {
        try {
            await this.apiCall(`/comments/${id}/approve`, 'PUT');
            this.showMessage('Comment approved!', 'success');
            await this.loadComments();
        } catch (error) {
            this.showMessage('Failed to approve comment', 'error');
        }
    }

    async deleteComment(id) {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        
        try {
            await this.apiCall(`/comments/${id}`, 'DELETE');
            this.showMessage('Comment deleted successfully!', 'success');
            await this.loadComments();
        } catch (error) {
            this.showMessage('Failed to delete comment', 'error');
        }
    }

    async editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) return;
        
        // Show edit modal with user data
        this.showUserModal(user);
    }

    async deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await this.apiCall(`/users/${id}`, 'DELETE');
            this.showMessage('User deleted successfully!', 'success');
            await this.loadUsers();
        } catch (error) {
            this.showMessage('Failed to delete user', 'error');
        }
    }

    // Modal Methods
    showBlogModal(blog = null) {
        // Implementation for blog modal
        console.log('Show blog modal:', blog);
    }

    showUserModal(user = null) {
        // Implementation for user modal
        console.log('Show user modal:', user);
    }

    // Utility Methods
    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message message-${type}`;
        messageDiv.textContent = message;
        
        // Add to page
        document.body.appendChild(messageDiv);
        
        // Show message
        setTimeout(() => messageDiv.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-open');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
