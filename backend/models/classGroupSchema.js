const mongoose = require("mongoose");

const classGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("classGroup", classGroupSchema);