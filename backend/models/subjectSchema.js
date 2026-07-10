const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true,
    },

    subCode: {
        type: String,
        required: true,
    },

    sessions: {
        type: String,
        required: true,
    },

    classGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classGroup',
        required: true,
    },

    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model("subject", subjectSchema);