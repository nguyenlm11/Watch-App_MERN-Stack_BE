const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema(
    {
        watchName: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        Automatic: { type: Boolean, default: false },
        watchDescription: { type: String, required: true },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Watch', watchSchema);
