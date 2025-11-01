const express = require('express');
const router = express.Router();

// Mock posts data
const posts = [
    {
        id: 1,
        title: "AI in Music: How algorithms compose symphonies that rival human creativity!",
        content: "Our latest neural network can generate classical music that's indistinguishable from pieces by Mozart and Beethoven. The future of music composition is here! #AIMusic #TechInnovation",
        author: "AI Research Lab",
        timestamp: "2 hours ago",
        category: "Technology",
        likes: 1250,
        comments: 89,
        shares: 156,
        image: "/images/posts/ai-music.jpg"
    },
    {
        id: 2,
        title: "Digital Art Revolution",
        content: "Exploring the intersection of AI and creativity. These AI-generated artworks are pushing the boundaries of what we consider art.",
        author: "Creative Studio",
        timestamp: "5 hours ago",
        category: "Art",
        likes: 892,
        comments: 67,
        shares: 234,
        image: "/images/posts/digital-art.jpg"
    }
];

// GET /api/posts
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: posts,
        total: posts.length
    });
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === parseInt(id));
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        });
    }
    
    res.json({
        success: true,
        data: post
    });
});

module.exports = router;
