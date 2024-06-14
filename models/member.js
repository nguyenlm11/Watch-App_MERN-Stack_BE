const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const memberSchema = new mongoose.Schema(
    {
        membername: { type: String, required: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        YOB: { type: Number, required: true },
        isAdmin: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
