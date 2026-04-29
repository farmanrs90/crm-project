const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
{
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true  
    },
    courseInterested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Lost', 'Accepted'],
        default: 'New'
    },
    source: {
        type: String,
        enum: ['Website', 'Referral', 'Social Media', 'Other'],
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    utmSource: {
        type: String
    },
    notes: {
        type: String
    }
},
{
    timestamps: true,
    versionKey: false
}
);

module.exports = mongoose.model('Lead', leadSchema);