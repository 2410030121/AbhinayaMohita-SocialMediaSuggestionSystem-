const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // TODO: Implement authentication logic
        // For now, return mock response
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: 1,
                name: 'User',
                email: email,
                avatar: null
            },
            token: 'mock-jwt-token'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;
        
        // TODO: Implement registration logic
        res.json({
            success: true,
            message: 'Registration successful',
            user: {
                id: Date.now(),
                name,
                email,
                age,
                gender,
                avatar: null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

module.exports = router;
