const express = require('express');
const router = express.Router();
const SpaceOptimization = require('../models/SpaceOptimization');

// Update space optimization data
router.post('/updateSpaceOptimization', async (req, res) => {
    try {
        const { logisticsAddress, spaceData } = req.body;

        // Find existing record or create new one
        let optimization = await SpaceOptimization.findOne({ logisticsAddress });
        
        if (optimization) {
            // Update existing record
            optimization.truckDimensions = spaceData.truckDimensions;
            optimization.freeSpace = spaceData.freeSpace;
            optimization.totalVolume = spaceData.totalVolume;
            optimization.occupiedVolume = spaceData.occupiedVolume;
            optimization.freeVolume = spaceData.freeVolume;
            optimization.freeSpacePercentage = spaceData.freeSpacePercentage;
            optimization.updatedAt = Date.now();
        } else {
            // Create new record
            optimization = new SpaceOptimization({
                logisticsAddress,
                ...spaceData,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        }

        await optimization.save();
        res.status(200).json({ message: 'Space optimization data updated successfully' });

    } catch (error) {
        console.error('Error updating space optimization:', error);
        res.status(500).json({ error: 'Failed to update space optimization data' });
    }
});

// Get space optimization data (for admin use only)
router.get('/getSpaceOptimization/:logisticsAddress', async (req, res) => {
    try {
        const optimization = await SpaceOptimization.findOne({ 
            logisticsAddress: req.params.logisticsAddress 
        });
        
        if (!optimization) {
            return res.status(404).json({ error: 'No data found' });
        }

        res.status(200).json(optimization);

    } catch (error) {
        console.error('Error fetching space optimization:', error);
        res.status(500).json({ error: 'Failed to fetch space optimization data' });
    }
});

module.exports = router; 