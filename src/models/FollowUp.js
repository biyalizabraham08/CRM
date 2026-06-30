const mongoose = require('mongoose');



const followUpSchema = new mongoose.Schema({
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    followUpDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

const Followup = mongoose.model('Followup',followUpSchema);

module.exports = Followup;
