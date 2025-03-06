const mongoose = require('mongoose');

const spaceOptimizationSchema = new mongoose.Schema({
    logisticsAddress: {
        type: String,
        required: true,
        unique: true
    },
    truckDimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    freeSpace: {
        length: Number,
        width: Number,
        height: Number
    },
    totalVolume: Number,
    occupiedVolume: Number,
    freeVolume: Number,
    freeSpacePercentage: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SpaceOptimization', spaceOptimizationSchema); 