const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({    
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    role: {
        type: String,
        enum: ["admin", "employee"],
        default: "employee"
    },
    email: {
        type: String,
        required: true,
        unique: true,   
        match: /^\S+@\S+\.\S+$/,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },


    createdAt: {    
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;