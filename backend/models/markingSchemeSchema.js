const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['PT1', 'PT2', 'HY', 'PT3', 'PT4', 'Annual'],
        required: true
    },
    term: {
        type: Number,
        enum: [1, 2],
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    weightage: {
        type: Number,
        required: true
    }
});

const markingSchemeSchema = new mongoose.Schema({
    classGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classGroup',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    assessments: [assessmentSchema]
}, { timestamps: true });

// One scheme per class per school
markingSchemeSchema.index({ classGroup: 1, school: 1 }, { unique: true });

module.exports = mongoose.model('MarkingScheme', markingSchemeSchema);