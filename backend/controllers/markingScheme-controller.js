const MarkingScheme = require('../models/markingSchemeSchema');

const DEFAULT_ASSESSMENTS = [
    { name: 'PT1',    term: 1, maxMarks: 20, weightage: 10 },
    { name: 'PT2',    term: 1, maxMarks: 20, weightage: 10 },
    { name: 'HY',     term: 1, maxMarks: 80, weightage: 30 },
    { name: 'PT3',    term: 2, maxMarks: 20, weightage: 10 },
    { name: 'PT4',    term: 2, maxMarks: 20, weightage: 10 },
    { name: 'Annual', term: 2, maxMarks: 80, weightage: 40 },
];

// GET — fetch scheme for a class, auto-create with defaults if none exists
const getMarkingScheme = async (req, res) => {
    try {
        const { classGroupId, schoolId } = req.params;

        let scheme = await MarkingScheme.findOne({
            classGroup: classGroupId,
            school: schoolId
        });

        if (!scheme) {
            scheme = await MarkingScheme.create({
                classGroup: classGroupId,
                school: schoolId,
                assessments: DEFAULT_ASSESSMENTS
            });
        }

        res.json(scheme);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching marking scheme', error });
    }
};

// PUT — admin updates the scheme (override max marks or weightage)
const updateMarkingScheme = async (req, res) => {
    try {
        const { classGroupId, schoolId } = req.params;
        const { assessments } = req.body;

        // Validate weightages sum to 100
        const total = assessments.reduce((sum, a) => sum + a.weightage, 0);
        if (total !== 100) {
            return res.status(400).json({
                message: `Weightages must sum to 100. Current total: ${total}`
            });
        }

        const scheme = await MarkingScheme.findOneAndUpdate(
            { classGroup: classGroupId, school: schoolId },
            { assessments },
            { new: true, upsert: true }
        );

        res.json(scheme);
    } catch (error) {
        res.status(500).json({ message: 'Error updating marking scheme', error });
    }
};

module.exports = { getMarkingScheme, updateMarkingScheme };