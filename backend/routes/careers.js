const express = require('express');
const router = express.Router();

// Sample job openings
let jobs = [
    {
        id: 1,
        title: "Frontend Developer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experience: "2-4 years",
        description: "We are looking for a skilled Frontend Developer to join our team...",
        requirements: [
            "Strong knowledge of HTML, CSS, JavaScript",
            "Experience with React or Vue.js",
            "Understanding of responsive design",
            "Git version control"
        ],
        posted: "2024-01-10",
        status: "active"
    },
    {
        id: 2,
        title: "Backend Developer",
        department: "Engineering",
        location: "New York",
        type: "Full-time",
        experience: "3-5 years",
        description: "Join our backend team to build scalable APIs...",
        requirements: [
            "Node.js and Express.js experience",
            "Database design (MongoDB/PostgreSQL)",
            "RESTful API development",
            "Cloud platforms (AWS/Azure)"
        ],
        posted: "2024-01-12",
        status: "active"
    }
];

// Sample applications
let applications = [];

// GET /api/careers/jobs - Get all job openings
router.get('/jobs', (req, res) => {
    try {
        const activeJobs = jobs.filter(job => job.status === 'active');
        res.json(activeJobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

// GET /api/careers/jobs/:id - Get single job
router.get('/jobs/:id', (req, res) => {
    try {
        const job = jobs.find(j => j.id === parseInt(req.params.id));
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job' });
    }
});

// POST /api/careers/apply - Submit job application
router.post('/apply', (req, res) => {
    try {
        const { 
            jobId, 
            firstName, 
            lastName, 
            email, 
            phone, 
            experience, 
            coverLetter,
            resume 
        } = req.body;
        
        const application = {
            id: applications.length + 1,
            jobId: parseInt(jobId),
            firstName,
            lastName,
            email,
            phone,
            experience,
            coverLetter,
            resume,
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        
        applications.push(application);
        res.status(201).json({ 
            message: 'Application submitted successfully!',
            applicationId: application.id 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// GET /api/careers/applications - Get all applications (admin)
router.get('/applications', (req, res) => {
    try {
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// PUT /api/careers/applications/:id - Update application status
router.put('/applications/:id', (req, res) => {
    try {
        const appIndex = applications.findIndex(a => a.id === parseInt(req.params.id));
        if (appIndex === -1) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        applications[appIndex] = { ...applications[appIndex], ...req.body };
        res.json(applications[appIndex]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating application' });
    }
});

module.exports = router;
