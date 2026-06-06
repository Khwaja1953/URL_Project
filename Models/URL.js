const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    url: { type: String, required: true, trim: true },
    shortId: { type: String, required: true, unique: true },
    visitHistory: [{type: String, default: Date.now()}],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;