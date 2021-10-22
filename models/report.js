const mongoose = require('mongoose');

const ReportsSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    location: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: false
    },
    category: {
        type: String, 
        required: true
    },
    importance: {
        type: Boolean, 
        required: true
    },
    status: {
        type: Boolean, 
        required: true
    },
    photoPath: {
        type: String, 
        required: false
    },
    date: {
        type: String, 
        required: true
    },
    time: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('reports', ReportsSchema);
