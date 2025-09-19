// Careers Page JavaScript

// Store job applications (in real app, this would be in a database)
let jobApplications = [];

// Store job listings (this will be managed by admin)
let jobListings = [];

document.addEventListener('DOMContentLoaded', function() {
    setupCareersEventListeners();
    loadJobListings();
});

function setupCareersEventListeners() {
    // Application form submission
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmission);
    }
}

function loadJobListings() {
    // Load job listings from localStorage (set by admin)
    const savedJobs = JSON.parse(localStorage.getItem('jobListings')) || [];
    jobListings = savedJobs;
    
    if (jobListings.length === 0) {
        // Add some default job listings for demo
        jobListings = [
            {
                id: Date.now(),
                title: "Frontend Developer",
                department: "Engineering",
                location: "Remote",
                type: "Full-time",
                salary: "$70,000 - $90,000",
                description: "We're looking for a talented Frontend Developer to join our engineering team. You'll work on building beautiful, responsive user interfaces for our blogging platform using modern web technologies.",
                requirements: [
                    "3+ years of experience with JavaScript, HTML, and CSS",
                    "Experience with React or Vue.js",
                    "Knowledge of responsive design principles",
                    "Familiarity with Git and version control",
                    "Strong problem-solving skills",
                    "Good communication and teamwork abilities"
                ],
                postedDate: new Date().toISOString(),
                status: "active"
            },
            {
                id: Date.now() + 1,
                title: "UI/UX Designer",
                department: "Design",
                location: "Remote",
                type: "Full-time",
                salary: "$60,000 - $80,000",
                description: "Join our design team to create intuitive and beautiful user experiences for BlogSpot. You'll be responsible for designing user interfaces, conducting user research, and improving our platform's usability.",
                requirements: [
                    "2+ years of UI/UX design experience",
                    "Proficiency in Figma, Sketch, or Adobe XD",
                    "Understanding of user-centered design principles",
                    "Experience with responsive design",
                    "Portfolio showcasing your design work",
                    "Knowledge of HTML/CSS is a plus"
                ],
                postedDate: new Date().toISOString(),
                status: "active"
            },
            {
                id: Date.now() + 2,
                title: "Content Marketing Specialist",
                department: "Marketing",
                location: "Remote",
                type: "Part-time",
                salary: "$40,000 - $55,000",
                description: "Help us grow BlogSpot's community by creating engaging content, managing our social media presence, and developing marketing strategies to attract new users and writers to our platform.",
                requirements: [
                    "2+ years of content marketing experience",
                    "Excellent writing and communication skills",
                    "Experience with social media management",
                    "Knowledge of SEO and content optimization",
                    "Understanding of blogging and content creation",
                    "Analytics and data-driven mindset"
                ],
                postedDate: new Date().toISOString(),
                status: "active"
            }
        ];
        // Save default jobs to localStorage
        localStorage.setItem('jobListings', JSON.stringify(jobListings));
    }
    
    displayJobListings();
}

function displayJobListings() {
    const jobsGrid = document.getElementById('jobsGrid');
    const noJobsMessage = document.getElementById('noJobsMessage');
    
    // Filter active jobs
    const activeJobs = jobListings.filter(job => job.status === 'active');
    
    if (activeJobs.length === 0) {
        jobsGrid.style.display = 'none';
        noJobsMessage.style.display = 'block';
        return;
    }
    
    jobsGrid.style.display = 'grid';
    noJobsMessage.style.display = 'none';
    
    jobsGrid.innerHTML = '';
    
    activeJobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsGrid.appendChild(jobCard);
    });
}

function createJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = 'job-card';
    
    const departmentIcon = getDepartmentIcon(job.department);
    
    jobCard.innerHTML = `
        <div class="job-header">
            <div class="job-icon">
                <img src="${departmentIcon}" alt="${job.department}">
            </div>
            <div class="job-info">
                <h3 class="job-title">${job.title}</h3>
                <span class="job-department">${job.department}</span>
            </div>
        </div>
        
        <div class="job-details">
            <div class="job-detail-item">
                <img src="https://cdn-icons-png.flaticon.com/128/1077/1077114.png" alt="Location">
                <span>${job.location}</span>
            </div>
            <div class="job-detail-item">
                <img src="https://cdn-icons-png.flaticon.com/128/3588/3588767.png" alt="Type">
                <span>${job.type}</span>
            </div>
            <div class="job-detail-item">
                <img src="https://cdn-icons-png.flaticon.com/128/2784/2784403.png" alt="Salary">
                <span>${job.salary}</span>
            </div>
        </div>
        
        <div class="job-description">
            ${job.description}
        </div>
        
        <div class="job-requirements">
            <h4>Requirements:</h4>
            <ul class="requirements-list">
                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
        
        <button class="apply-btn" onclick="openApplicationForm('${job.id}', '${job.title}')">
            <img src="https://cdn-icons-png.flaticon.com/128/3588/3588611.png" alt="Apply">
            Apply Now
        </button>
    `;
    
    return jobCard;
}

function getDepartmentIcon(department) {
    const icons = {
        'Engineering': 'https://cdn-icons-png.flaticon.com/128/1005/1005141.png',
        'Design': 'https://cdn-icons-png.flaticon.com/128/3588/3588435.png',
        'Marketing': 'https://cdn-icons-png.flaticon.com/128/2784/2784459.png',
        'Sales': 'https://cdn-icons-png.flaticon.com/128/1077/1077114.png',
        'Support': 'https://cdn-icons-png.flaticon.com/128/681/681494.png',
        'Operations': 'https://cdn-icons-png.flaticon.com/128/2040/2040504.png'
    };
    return icons[department] || 'https://cdn-icons-png.flaticon.com/128/1946/1946436.png';
}

function openApplicationForm(jobId, jobTitle) {
    // Scroll to application section
    document.getElementById('applicationSection').style.display = 'block';
    document.getElementById('applicationPosition').value = jobTitle;
    
    // Store job ID for submission
    document.getElementById('applicationForm').dataset.jobId = jobId;
    
    // Scroll to form
    document.getElementById('applicationSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function closeApplicationForm() {
    document.getElementById('applicationSection').style.display = 'none';
    document.getElementById('applicationForm').reset();
}

function handleApplicationSubmission(e) {
    e.preventDefault();
    
    if (!validateApplicationForm()) {
        return false;
    }
    
    const jobId = e.target.dataset.jobId;
    const job = jobListings.find(j => j.id.toString() === jobId);
    
    const applicationData = {
        id: Date.now(),
        jobId: jobId,
        jobTitle: job ? job.title : document.getElementById('applicationPosition').value,
        applicantName: document.getElementById('applicantName').value,
        applicantEmail: document.getElementById('applicantEmail').value,
        applicantPhone: document.getElementById('applicantPhone').value,
        experience: document.getElementById('applicantExperience').value,
        resumeLink: document.getElementById('applicantResume').value,
        portfolioLink: document.getElementById('applicantPortfolio').value,
        coverLetter: document.getElementById('applicantCoverLetter').value,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        adminRemarks: []
    };
    
    // Add to applications array (in real app, send to backend)
    jobApplications.push(applicationData);
    
    // Store in localStorage for admin panel access
    const existingApplications = JSON.parse(localStorage.getItem('jobApplications')) || [];
    existingApplications.push(applicationData);
    localStorage.setItem('jobApplications', JSON.stringify(existingApplications));
    
    // Show success modal
    showSuccessModal();
    
    // Reset and hide form
    closeApplicationForm();
    
    // Simulate email sending (in real app, this would be done by backend)
    console.log('Application email sent to:', applicationData.applicantEmail);
    console.log('Application data:', applicationData);
}

function validateApplicationForm() {
    const name = document.getElementById('applicantName').value.trim();
    const email = document.getElementById('applicantEmail').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    const experience = document.getElementById('applicantExperience').value;
    const resume = document.getElementById('applicantResume').value.trim();
    const coverLetter = document.getElementById('applicantCoverLetter').value.trim();
    
    if (!name) {
        alert('Please enter your full name');
        return false;
    }
    
    if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!phone) {
        alert('Please enter your phone number');
        return false;
    }
    
    if (!experience) {
        alert('Please select your experience level');
        return false;
    }
    
    if (!resume || !validateURL(resume)) {
        alert('Please provide a valid link to your resume');
        return false;
    }
    
    if (!coverLetter || coverLetter.length < 50) {
        alert('Please provide a detailed cover letter (at least 50 characters)');
        return false;
    }
    
    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showSuccessModal() {
    document.getElementById('successModal').style.display = 'block';
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeSuccessModal();
    }, 5000);
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeSuccessModal();
    }
});

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

// Character counter for cover letter textarea
const coverLetterTextarea = document.getElementById('applicantCoverLetter');
if (coverLetterTextarea) {
    const charCounter = document.createElement('div');
    charCounter.style.cssText = 'text-align: right; font-size: 12px; color: #999; margin-top: 5px;';
    charCounter.textContent = '0 / 1000 characters';
    coverLetterTextarea.parentNode.appendChild(charCounter);
    
    coverLetterTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCounter.textContent = `${length} / 1000 characters`;
        
        if (length > 1000) {
            charCounter.style.color = '#ff6384';
            this.value = this.value.substring(0, 1000);
        } else if (length < 50) {
            charCounter.style.color = '#ff6384';
        } else {
            charCounter.style.color = '#999';
        }
    });
}

// Get application status label
function getApplicationStatusLabel(status) {
    const labels = {
        'pending': 'Pending Review',
        'reviewing': 'Under Review',
        'interview': 'Interview Scheduled',
        'rejected': 'Not Selected',
        'hired': 'Hired'
    };
    return labels[status] || status;
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
