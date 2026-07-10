const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    /* ─────────────────────────────
        CORE
    ───────────────────────────── */

    name: {
        type: String,
        required: true,
        trim: true
    },

    rollNum: {
        type: Number,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },

    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },

    role: {
        type: String,
        default: "Student"
    },

    /* ─────────────────────────────
        BASIC INFO
    ───────────────────────────── */

    admissionDate: {
        type: Date
    },

    dob: {
        type: Date
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },

    category: {
        type: String,
        trim: true
    },

    /* ─────────────────────────────
        ADDRESS
    ───────────────────────────── */

    address: {
        type: String,
        trim: true
    },

    /* ─────────────────────────────
        PARENT / GUARDIAN
    ───────────────────────────── */

    fatherName: {
        type: String,
        trim: true
    },

    fatherPhone: {
        type: String,
        trim: true
    },

    motherName: {
        type: String,
        trim: true
    },

    motherPhone: {
        type: String,
        trim: true
    },

    guardianName: {
        type: String,
        trim: true
    },

    guardianRelation: {
        type: String,
        trim: true
    },

    guardianPhone: {
        type: String,
        trim: true
    },

    /* ─────────────────────────────
        MEDICAL
    ───────────────────────────── */

    bloodGroup: {
        type: String,
        trim: true
    },

    medicalHistory: {
        type: String,
        trim: true
    },

    /* ─────────────────────────────
        EXAM RESULTS
    ───────────────────────────── */

    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
                required: true
            },

            marks: [
                {
                    term: {
                        type: Number,
                        required: true
                    },

                    examType: {
                        type: String,
                        required: true
                    },

                    marksObtained: {
                        type: Number,
                        default: 0
                    },

                    maxMarks: {
                        type: Number,
                        default: 100
                    },

                    lastUpdated: {
                        type: Date,
                        default: Date.now
                    }
                }
            ]
        }
    ],

    /* ─────────────────────────────
        DAILY ATTENDANCE
    ───────────────────────────── */

    attendance: [
        {
            date: {
                type: String, // YYYY-MM-DD
                required: true
            },

            status: {
                type: String,
                enum: ['Present', 'Absent'],
                required: true
            }
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model("student", studentSchema);