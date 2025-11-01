const express = require('express');
const router = express.Router();

// Mock trending reels data
const trendingReels = [
    { id: 1, title: "AI Art Creation Tutorial", category: "tech", description: "Learn how to create stunning AI artwork using latest tools", time: "today", views: "2.5M", thumbnail: "/images/thumbnails/ai-art.jpg", creator: "AI Research Lab" },
    { id: 2, title: "Dance Challenge #AIVibes", category: "dance", description: "The hottest dance trend taking over social media", time: "today", views: "5.2M", thumbnail: "/images/thumbnails/dance.jpg", creator: "DanceStudio Pro" },
    { id: 3, title: "Tech Tips: Coding Shortcuts", category: "tech", description: "10 coding shortcuts every developer should know", time: "week", views: "1.8M", thumbnail: "/images/thumbnails/coding.jpg", creator: "CodeMaster" },
    { id: 4, title: "Music Remix: Electronic Beats", category: "music", description: "Amazing electronic remix of popular songs", time: "today", views: "3.1M", thumbnail: "/images/thumbnails/music.jpg", creator: "BeatMaker Studio" },
    { id: 5, title: "Comedy Skit: Office Life", category: "comedy", description: "Hilarious take on modern office culture", time: "week", views: "4.7M", thumbnail: "/images/thumbnails/comedy.jpg", creator: "Comedy Central" },
    { id: 6, title: "Life Hacks: Productivity Tips", category: "lifestyle", description: "Simple hacks to boost your daily productivity", time: "month", views: "2.9M", thumbnail: "/images/thumbnails/lifehacks.jpg", creator: "Productivity Guru" },
    { id: 7, title: "Art Speed Drawing", category: "art", description: "Mesmerizing digital art creation process", time: "today", views: "1.5M", thumbnail: "/images/thumbnails/art.jpg", creator: "Digital Artist" },
    { id: 8, title: "Educational: Space Facts", category: "education", description: "Mind-blowing facts about our universe", time: "week", views: "2.2M", thumbnail: "/images/thumbnails/space.jpg", creator: "Space Explorer" },
    { id: 9, title: "Sports Highlights: Football", category: "sports", description: "Best goals and moments from recent matches", time: "today", views: "6.8M", thumbnail: "/images/thumbnails/sports.jpg", creator: "Sports Network" },
    { id: 10, title: "Music Cover: Acoustic Session", category: "music", description: "Beautiful acoustic covers of trending songs", time: "month", views: "1.9M", thumbnail: "/images/thumbnails/acoustic.jpg", creator: "Acoustic Sessions" }
];

// GET /api/reels/trending
router.get('/trending', (req, res) => {
    const { category, time, search } = req.query;
    
    let filteredReels = [...trendingReels];
    
    // Filter by category
    if (category && category !== 'all') {
        filteredReels = filteredReels.filter(reel => reel.category === category);
    }
    
    // Filter by time
    if (time && time !== 'all') {
        filteredReels = filteredReels.filter(reel => reel.time === time);
    }
    
    // Filter by search term
    if (search) {
        const searchLower = search.toLowerCase();
        filteredReels = filteredReels.filter(reel => 
            reel.title.toLowerCase().includes(searchLower) ||
            reel.description.toLowerCase().includes(searchLower) ||
            reel.creator.toLowerCase().includes(searchLower)
        );
    }
    
    res.json({
        success: true,
        data: filteredReels,
        total: filteredReels.length
    });
});

// GET /api/reels/:id
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const reel = trendingReels.find(r => r.id === parseInt(id));
    
    if (!reel) {
        return res.status(404).json({
            success: false,
            message: 'Reel not found'
        });
    }
    
    res.json({
        success: true,
        data: reel
    });
});

module.exports = router;
