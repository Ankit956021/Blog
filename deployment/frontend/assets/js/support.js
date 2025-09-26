// Support Page JavaScript

// Store support tickets (in real app, this would be in a database)
let supportTickets = [];

document.addEventListener('DOMContentLoaded', function() {
    setupSupportEventListeners();
});

function setupSupportEventListeners() {
    // Ticket form submission
    const ticketForm = document.getElementById('ticketForm');
    if (ticketForm) {
        ticketForm.addEventListener('submit', handleTicketSubmission);
    }
}

function handleTicketSubmission(e) {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        name: document.getElementById('ticketName').value,
        email: document.getElementById('ticketEmail').value,
        subject: document.getElementById('ticketSubject').value,
        priority: document.getElementById('ticketPriority').value,
        description: document.getElementById('ticketDescription').value,
        status: 'open',
        createdAt: new Date().toISOString(),
        adminRemarks: []
    };
    
    // Add to tickets array (in real app, send to backend)
    supportTickets.push(formData);
    
    // Store in localStorage for admin panel access
    const existingTickets = JSON.parse(localStorage.getItem('supportTickets')) || [];
    existingTickets.push(formData);
    localStorage.setItem('supportTickets', JSON.stringify(existingTickets));
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    document.getElementById('ticketForm').reset();
    
    // Simulate email sending (in real app, this would be done by backend)
    console.log('Email sent to:', formData.email);
    console.log('Ticket data:', formData);
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeSuccessModal();
        }, 5000);
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('active');
            item.querySelector('.faq-icon').textContent = '+';
        }
    });
    
    // Toggle current FAQ item
    if (isActive) {
        faqItem.classList.remove('active');
        faqAnswer.classList.remove('active');
        element.querySelector('.faq-icon').textContent = '+';
    } else {
        faqItem.classList.add('active');
        faqAnswer.classList.add('active');
        element.querySelector('.faq-icon').textContent = '−';
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeSuccessModal();
    }
});

// Get priority label for display
function getPriorityLabel(priority) {
    const labels = {
        low: 'Low Priority',
        medium: 'Medium Priority',
        high: 'High Priority',
        critical: 'Critical'
    };
    return labels[priority] || priority;
}

// Get subject label for display
function getSubjectLabel(subject) {
    const labels = {
        'login-issue': 'Login/Registration Issue',
        'blog-posting': 'Blog Posting Problem',
        'comment-issue': 'Comment System Issue',
        'technical-bug': 'Technical Bug',
        'feature-request': 'Feature Request',
        'account-issue': 'Account Related Issue',
        'other': 'Other'
    };
    return labels[subject] || subject;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Auto-expand first FAQ item on page load
document.addEventListener('DOMContentLoaded', function() {
    const firstFAQ = document.querySelector('.faq-item .faq-question');
    if (firstFAQ) {
        setTimeout(() => {
            toggleFAQ(firstFAQ);
        }, 500);
    }
});

// Form validation enhancements
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm() {
    const name = document.getElementById('ticketName').value.trim();
    const email = document.getElementById('ticketEmail').value.trim();
    const subject = document.getElementById('ticketSubject').value;
    const description = document.getElementById('ticketDescription').value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return false;
    }
    
    if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!subject) {
        alert('Please select an issue type');
        return false;
    }
    
    if (!description || description.length < 10) {
        alert('Please provide a detailed description (at least 10 characters)');
        return false;
    }
    
    return true;
}

// Add form validation to submit handler
document.getElementById('ticketForm').addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
        return false;
    }
});

// Character counter for description textarea
const descriptionTextarea = document.getElementById('ticketDescription');
if (descriptionTextarea) {
    const charCounter = document.createElement('div');
    charCounter.style.cssText = 'text-align: right; font-size: 12px; color: #999; margin-top: 5px;';
    charCounter.textContent = '0 / 500 characters';
    descriptionTextarea.parentNode.appendChild(charCounter);
    
    descriptionTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length} / 500 characters`;
        
        if (length > 500) {
            charCounter.style.color = '#ff6384';
        } else if (length > 400) {
            charCounter.style.color = '#ff8c00';
        } else {
            charCounter.style.color = '#999';
        }
    });
}
