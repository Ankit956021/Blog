const express = require('express');
const router = express.Router();
const appwriteService = require('../services/appwriteService');

// Submit career application
router.post('/', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            position, 
            experience, 
            skills, 
            cover_letter, 
            resume_url 
        } = req.body;
        
        // Validation
        if (!name || !email || !position || !experience || !skills) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, position, experience, and skills are required'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }
        
        const applicationData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            position: position.trim(),
            experience: experience.trim(),
            skills: skills.trim(),
            cover_letter: cover_letter ? cover_letter.trim() : null,
            resume_url: resume_url || null
        };
        
        const newApplication = await appwriteService.createCareerApplication(applicationData);
        
        res.status(201).json({
            success: true,
            data: newApplication,
            message: 'Career application submitted successfully! We will review it and get back to you soon.'
        });
    } catch (error) {
        console.error('Error creating career application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit career application',
            error: error.message
        });
    }
});

// Get all career applications (admin only)
router.get('/admin/all', async (req, res) => {
    try {
        const { 
            status = 'all', 
            position = 'all', 
            limit = 50, 
            offset = 0 
        } = req.query;
        const { Query } = require('node-appwrite');
        
        let queries = [
            Query.orderDesc('created_at'),
            Query.limit(parseInt(limit)),
            Query.offset(parseInt(offset))
        ];
        
        if (status !== 'all') {
            queries.push(Query.equal('status', status));
        }
        
        if (position !== 'all') {
            queries.push(Query.search('position', position));
        }
        
        const applications = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            queries
        );
        
        res.status(200).json({
            success: true,
            data: applications.documents || [],
            total: applications.total || 0,
            message: 'Career applications fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching career applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch career applications',
            error: error.message
        });
    }
});

// Update application status (admin only)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validation
        if (!['pending', 'reviewing', 'interviewed', 'hired', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be: pending, reviewing, interviewed, hired, or rejected'
            });
        }
        
        const updatedApplication = await appwriteService.db.updateDocument(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            id,
            { status }
        );
        
        res.status(200).json({
            success: true,
            data: updatedApplication,
            message: `Application status updated to ${status}`
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status',
            error: error.message
        });
    }
});

// Get application by ID (admin only)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const application = await appwriteService.db.getDocument(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            id
        );
        
        res.status(200).json({
            success: true,
            data: application,
            message: 'Application fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(404).json({
            success: false,
            message: 'Application not found',
            error: error.message
        });
    }
});

// Get career application statistics
router.get('/stats', async (req, res) => {
    try {
        const { Query } = require('node-appwrite');
        
        const pendingApplications = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            [Query.equal('status', 'pending'), Query.limit(1)]
        );
        
        const reviewingApplications = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            [Query.equal('status', 'reviewing'), Query.limit(1)]
        );
        
        const interviewedApplications = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            [Query.equal('status', 'interviewed'), Query.limit(1)]
        );
        
        const hiredApplications = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            [Query.equal('status', 'hired'), Query.limit(1)]
        );
        
        const rejectedApplications = await appwriteService.db.listDocuments(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            [Query.equal('status', 'rejected'), Query.limit(1)]
        );
        
        res.status(200).json({
            success: true,
            data: {
                pending: pendingApplications.total || 0,
                reviewing: reviewingApplications.total || 0,
                interviewed: interviewedApplications.total || 0,
                hired: hiredApplications.total || 0,
                rejected: rejectedApplications.total || 0,
                total: (pendingApplications.total || 0) + 
                       (reviewingApplications.total || 0) + 
                       (interviewedApplications.total || 0) + 
                       (hiredApplications.total || 0) + 
                       (rejectedApplications.total || 0)
            },
            message: 'Career application statistics fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching career stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch career statistics',
            error: error.message
        });
    }
});

// Delete application (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        await appwriteService.db.deleteDocument(
            appwriteService.databaseId,
            appwriteService.collections.careers,
            id
        );
        
        res.status(200).json({
            success: true,
            message: 'Career application deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete application',
            error: error.message
        });
    }
});

// Get available positions (public endpoint)
router.get('/public/positions', async (req, res) => {
    try {
        // This would typically come from a separate positions collection
        // For now, we'll return some sample positions
        const positions = [
            {
                id: 1,
                title: 'Frontend Developer',
                description: 'Build amazing user interfaces with React and modern web technologies',
                requirements: ['React', 'JavaScript', 'CSS', 'HTML'],
                type: 'full-time',
                location: 'Remote'
            },
            {
                id: 2,
                title: 'Backend Developer',
                description: 'Develop robust APIs and server-side applications',
                requirements: ['Node.js', 'Express', 'Database', 'API Design'],
                type: 'full-time',
                location: 'Remote'
            },
            {
                id: 3,
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend development',
                requirements: ['React', 'Node.js', 'Database', 'REST APIs'],
                type: 'full-time',
                location: 'Remote'
            },
            {
                id: 4,
                title: 'Content Writer',
                description: 'Create engaging blog content and technical documentation',
                requirements: ['Writing', 'SEO', 'Research', 'Communication'],
                type: 'part-time',
                location: 'Remote'
            }
        ];
        
        res.status(200).json({
            success: true,
            data: positions,
            message: 'Available positions fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching positions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch positions',
            error: error.message
        });
    }
});

module.exports = router;
