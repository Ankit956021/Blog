// Sample data
let currentUser = null;
let adminBlogs = [
    {
        id: 1,
        title: "Welcome to Our Modern Blog Platform",
        category: "Announcement",
        content: "We're excited to introduce our new blog platform with modern features and beautiful design. This platform allows you to share your thoughts, stories, and experiences with a growing community of writers and readers. Our goal is to create a space where creativity meets technology, and where every voice can be heard.",
        excerpt: "We're excited to introduce our new blog platform with modern features and beautiful design...",
        author: "Admin",
        date: "2025-01-18",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
        likes: 25,
        comments: []
    },
    {
        id: 2,
        title: "The Future of Digital Storytelling",
        category: "Technology",
        content: "Digital storytelling has evolved tremendously over the past decade. From simple text-based blogs to interactive multimedia experiences, the way we share stories has transformed. Today's readers expect engaging, visually appealing content that can be consumed across multiple devices. This shift has opened new opportunities for writers to experiment with different formats and reach wider audiences.",
        excerpt: "Digital storytelling has evolved tremendously over the past decade...",
        author: "Admin",
        date: "2025-01-17",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop",
        likes: 18,
        comments: []
    },
    {
        id: 3,
        title: "Building Communities Through Content",
        category: "Community",
        content: "One of the most powerful aspects of blogging is its ability to bring people together. When we share our experiences, challenges, and insights, we create connections that transcend geographical boundaries. A well-crafted blog post can spark conversations, inspire action, and build lasting relationships between readers and writers.",
        excerpt: "One of the most powerful aspects of blogging is its ability to bring people together...",
        author: "Admin",
        date: "2025-01-16",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        likes: 32,
        comments: []
    }
];

let userBlogs = [];
let newsItems = [
    "Welcome to our new blog platform! Share your stories with the world.",
    "New features released: Enhanced comment system and improved user experience.",
    "Join our growing community of writers and readers from around the globe.",
    "Weekly writing challenges starting soon - stay tuned for more details!"
];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const authForm = document.getElementById('authForm');
const switchBtn = document.getElementById('switchBtn');
const modalTitle = document.getElementById('modalTitle');
const authBtn = document.getElementById('authBtn');
const authText = document.getElementById('authText');
const authIcon = document.getElementById('authIcon');
const nameGroup = document.getElementById('nameGroup');
const switchText = document.getElementById('switchText');

const blogModal = document.getElementById('blogModal');
const closeBlogModal = document.getElementById('closeBlogModal');
const addBlogModal = document.getElementById('addBlogModal');
const closeAddBlogModal = document.getElementById('closeAddBlogModal');
const addBlogBtn = document.getElementById('add-blog-btn');
const blogForm = document.getElementById('blogForm');

const adminBlogsContainer = document.getElementById('adminBlogs');
const userBlogsContainer = document.getElementById('userBlogs');
const newsTicker = document.getElementById('newsTicker');
const newsletterForm = document.getElementById('newsletterForm');

let isLoginMode = true;
let currentBlogId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadBlogs();
    startNewsTicker();
    setupEventListeners();
    checkUserSession();
}

function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateLoginButton();
    }
}

function setupEventListeners() {
    // Login modal
    loginBtn.addEventListener('click', openLoginModal);
    closeLoginModal.addEventListener('click', closeModal);
    authForm.addEventListener('submit', handleAuth);
    switchBtn.addEventListener('click', toggleAuthMode);

    // Blog modals
    closeBlogModal.addEventListener('click', () => blogModal.style.display = 'none');
    addBlogBtn.addEventListener('click', openAddBlogModal);
    closeAddBlogModal.addEventListener('click', () => addBlogModal.style.display = 'none');
    blogForm.addEventListener('submit', handleBlogSubmission);

    // Newsletter
    newsletterForm.addEventListener('submit', handleNewsletterSubscription);

    // Comments
    document.getElementById('submitComment').addEventListener('click', handleCommentSubmission);

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            closeModal();
        }
        if (event.target === blogModal) {
            blogModal.style.display = 'none';
        }
        if (event.target === addBlogModal) {
            addBlogModal.style.display = 'none';
        }
    });

    // Smooth scrolling for navigation (only for internal links)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Only prevent default for internal hash links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Update active states for internal navigation
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
            // For external links (pages/support.html, pages/careers.html), let them work normally
        });
    });

    // Handle back navigation and update active states
    window.addEventListener('scroll', function() {
        const sections = ['home', 'blogs'];
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    });

    // Get started button
    document.getElementById('getStartedBtn').addEventListener('click', function() {
        document.getElementById('blogs').scrollIntoView({ behavior: 'smooth' });
    });

    // View all button
    document.getElementById('viewAllBtn').addEventListener('click', function() {
        showAllBlogs();
    });
}

function openLoginModal() {
    if (currentUser) {
        // User is logged in, show logout option
        if (confirm('Do you want to logout?')) {
            logout();
        }
    } else {
        loginModal.style.display = 'block';
    }
}

function closeModal() {
    loginModal.style.display = 'none';
    resetAuthForm();
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        modalTitle.textContent = 'Login';
        authText.textContent = 'Login';
        authIcon.src = 'https://cdn-icons-png.flaticon.com/128/1828/1828490.png';
        nameGroup.style.display = 'none';
        switchText.innerHTML = 'Don\'t have an account? <button type="button" id="switchBtn">Register</button>';
    } else {
        modalTitle.textContent = 'Register';
        authText.textContent = 'Register';
        authIcon.src = 'https://cdn-icons-png.flaticon.com/128/1828/1828784.png';
        nameGroup.style.display = 'block';
        switchText.innerHTML = 'Already have an account? <button type="button" id="switchBtn">Login</button>';
    }
    
    // Re-attach event listener to new switch button
    document.getElementById('switchBtn').addEventListener('click', toggleAuthMode);
}

function resetAuthForm() {
    authForm.reset();
    isLoginMode = true;
    modalTitle.textContent = 'Login';
    authText.textContent = 'Login';
    authIcon.src = 'https://cdn-icons-png.flaticon.com/128/1828/1828490.png';
    nameGroup.style.display = 'none';
    switchText.innerHTML = 'Don\'t have an account? <button type="button" id="switchBtn">Register</button>';
    document.getElementById('switchBtn').addEventListener('click', toggleAuthMode);
}

function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    if (isLoginMode) {
        // Login logic - only for regular users
        if (email && password) {
            // Check if user is trying to login as admin
            if (email === 'admin@blog.com') {
                showMessage('Admin login is not allowed here. Please use the admin panel.', 'error');
                return;
            }
            
            currentUser = {
                id: Date.now(),
                name: name || email.split('@')[0],
                email: email,
                isAdmin: false // Regular users are never admin
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Login successful!', 'success');
            updateLoginButton();
            closeModal();
        }
    } else {
        // Register logic - only for regular users
        if (name && email && password) {
            // Prevent admin email registration
            if (email === 'admin@blog.com') {
                showMessage('This email is reserved for admin use.', 'error');
                return;
            }
            
            currentUser = {
                id: Date.now(),
                name: name,
                email: email,
                isAdmin: false // Regular users are never admin
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showMessage('Registration successful!', 'success');
            updateLoginButton();
            closeModal();
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateLoginButton();
    showMessage('Logged out successfully!', 'success');
}

function updateLoginButton() {
    if (currentUser) {
        loginBtn.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="Profile" class="login-icon">
            ${currentUser.name}
        `;
    } else {
        loginBtn.innerHTML = `
            <img src="https://cdn-icons-png.flaticon.com/128/1828/1828490.png" alt="Login" class="login-icon">
            Login
        `;
    }
}

function openAddBlogModal() {
    if (!currentUser) {
        showMessage('Please login to create a blog post!', 'error');
        openLoginModal();
        return;
    }
    addBlogModal.style.display = 'block';
}

function handleBlogSubmission(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showMessage('Please login to create a blog post!', 'error');
        return;
    }
    
    const title = document.getElementById('blogTitle').value;
    const category = document.getElementById('blogCategory').value;
    const content = document.getElementById('blogContent').value;
    const image = document.getElementById('blogImage').value || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop';
    
    const newBlog = {
        id: Date.now(),
        title: title,
        category: category,
        content: content,
        excerpt: content.substring(0, 150) + '...',
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        image: image,
        likes: 0,
        comments: [],
        isUserPost: !currentUser.isAdmin
    };
    
    if (currentUser.isAdmin) {
        adminBlogs.unshift(newBlog);
    } else {
        userBlogs.unshift(newBlog);
    }
    
    showMessage('Blog post created successfully!', 'success');
    addBlogModal.style.display = 'none';
    blogForm.reset();
    loadBlogs();
}

function loadBlogs() {
    // Load admin blogs
    adminBlogsContainer.innerHTML = '';
    adminBlogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        adminBlogsContainer.appendChild(blogCard);
    });
    
    // Load user blogs
    userBlogsContainer.innerHTML = '';
    if (userBlogs.length === 0) {
        userBlogsContainer.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">No community posts yet. Be the first to share your story!</p>';
    } else {
        userBlogs.forEach(blog => {
            const blogCard = createBlogCard(blog);
            userBlogsContainer.appendChild(blogCard);
        });
    }
}

function createBlogCard(blog) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.onclick = () => openBlogPost(blog);
    
    card.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}" class="blog-image">
        <div class="blog-content">
            <span class="blog-category">${blog.category}</span>
            <h3 class="blog-title">${blog.title}</h3>
            <p class="blog-excerpt">${blog.excerpt}</p>
            <div class="blog-meta">
                <span class="blog-author">By ${blog.author}</span>
                <span class="blog-date">${formatDate(blog.date)}</span>
            </div>
            <div class="blog-actions">
                <button class="like-btn ${blog.liked ? 'liked' : ''}" onclick="toggleLike(event, ${blog.id})">
                    ❤️ ${blog.likes}
                </button>
                <span style="color: #999; font-size: 12px;">${blog.comments.length} comments</span>
            </div>
        </div>
    `;
    
    return card;
}

function openBlogPost(blog) {
    currentBlogId = blog.id;
    const blogPostFull = document.getElementById('blogPostFull');
    
    blogPostFull.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}">
        <h1>${blog.title}</h1>
        <div class="meta">
            <span>By ${blog.author}</span>
            <span>${formatDate(blog.date)}</span>
            <span>${blog.category}</span>
        </div>
        <div class="content">
            ${blog.content}
        </div>
        <div class="blog-actions" style="margin-top: 20px;">
            <button class="like-btn ${blog.liked ? 'liked' : ''}" onclick="toggleLike(event, ${blog.id})">
                ❤️ ${blog.likes}
            </button>
        </div>
    `;
    
    loadComments(blog.id);
    blogModal.style.display = 'block';
}

function loadComments(blogId) {
    const blog = findBlogById(blogId);
    const commentsList = document.getElementById('commentsList');
    
    if (blog.comments.length === 0) {
        commentsList.innerHTML = '<p style="color: #666; text-align: center;">No comments yet. Be the first to comment!</p>';
    } else {
        commentsList.innerHTML = '';
        blog.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-date">${formatDate(comment.date)}</div>
            `;
            commentsList.appendChild(commentDiv);
        });
    }
}

function handleCommentSubmission() {
    if (!currentUser) {
        showMessage('Please login to comment!', 'error');
        openLoginModal();
        return;
    }
    
    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) {
        showMessage('Please enter a comment!', 'error');
        return;
    }
    
    const blog = findBlogById(currentBlogId);
    if (blog) {
        const newComment = {
            id: Date.now(),
            author: currentUser.name,
            text: commentText,
            date: new Date().toISOString().split('T')[0]
        };
        
        blog.comments.push(newComment);
        document.getElementById('commentText').value = '';
        loadComments(currentBlogId);
        showMessage('Comment added successfully!', 'success');
    }
}

function toggleLike(event, blogId) {
    event.stopPropagation();
    
    if (!currentUser) {
        showMessage('Please login to like posts!', 'error');
        openLoginModal();
        return;
    }
    
    const blog = findBlogById(blogId);
    if (blog) {
        if (blog.liked) {
            blog.likes -= 1;
            blog.liked = false;
        } else {
            blog.likes += 1;
            blog.liked = true;
        }
        loadBlogs();
        
        // Update the blog modal if it's open
        if (currentBlogId === blogId && blogModal.style.display === 'block') {
            openBlogPost(blog);
        }
    }
}

function findBlogById(id) {
    return adminBlogs.find(blog => blog.id === id) || userBlogs.find(blog => blog.id === id);
}

function showAllBlogs() {
    document.getElementById('blogs').scrollIntoView({ behavior: 'smooth' });
    // Here you could implement pagination or expand the view
}

function startNewsTicker() {
    let currentIndex = 0;
    const tickerSpan = newsTicker.querySelector('span');
    
    function updateTicker() {
        tickerSpan.textContent = newsItems[currentIndex];
        currentIndex = (currentIndex + 1) % newsItems.length;
    }
    
    updateTicker(); // Initial load
    setInterval(updateTicker, 8000); // Change every 8 seconds
}

function handleNewsletterSubscription(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showMessage('Thank you for subscribing to our newsletter!', 'success');
        e.target.reset();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Auto-scroll functionality for blog carousel
function initAutoScroll() {
    const carousel = document.getElementById('blogCarousel');
    let isScrolling = false;
    
    setInterval(() => {
        if (!isScrolling) {
            carousel.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
            
            // Reset to beginning if at end
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                setTimeout(() => {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                }, 2000);
            }
        }
    }, 4000);
    
    // Pause auto-scroll on hover
    carousel.addEventListener('mouseenter', () => isScrolling = true);
    carousel.addEventListener('mouseleave', () => isScrolling = false);
}

// Initialize auto-scroll after page load
setTimeout(initAutoScroll, 1000);

// Admin Panel Functions (for future implementation)
function openAdminPanel() {
    if (currentUser && currentUser.isAdmin) {
        // This would open a separate admin interface
        console.log('Opening admin panel...');
    }
}

// Responsive menu toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.style.display = navMenu.style.display === 'block' ? 'none' : 'block';
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').style.display = '';
    }
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);
