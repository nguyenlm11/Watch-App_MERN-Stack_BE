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

// memberSchema.pre('save', async function (next) {
//     if (this.isModified('password') || this.isNew) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// memberSchema.methods.comparePassword = function (candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
// };

module.exports = mongoose.model('Member', memberSchema);
