const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    // Allows you to filter "Holiday", "Exam", "Event", or "General"
    category: {
        type: String,
        enum: ['Announcement', 'Event', 'Holiday', 'Exam'],
        default: 'Announcement'
    },
   
    showOnCalendar: {
        type: Boolean,
        default: false
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

module.exports = mongoose.model("notice", noticeSchema);