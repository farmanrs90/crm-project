const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        },
        durationMonths: {
            type: Number,
            min: 1

        },
        price: {
            type: Number,
            min: 0,
            required: true

        },
        description: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        syllabus: {
            type: String
        }
    }, {
    timestamps: true,
    versionKey: false
}
);
module.exports = mongoose.model('Course', courseSchema);