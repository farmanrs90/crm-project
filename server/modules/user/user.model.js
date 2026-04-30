const mongoose = require('mongoose');
const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'manager', 'student', 'accountant'],
        default: 'manager'
    }
},
    {
        timestamps: true,
        versionKey: false
    });
module.exports = mongoose.model('User', userShema);