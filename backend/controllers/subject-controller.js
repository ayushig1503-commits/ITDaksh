const Subject = require("../models/subjectSchema.js");
const Teacher = require("../models/teacherSchema.js");
const Student = require("../models/studentSchema.js");
const { audit } = require("../utils/audit.js");

const subjectCreate = async (req, res) => {
    try {
        const subjects = req.body.subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
            classGroup: req.body.classGroup,
            school: req.body.adminID,
        }));

        // Check if first subcode exists in this school
        const existingSubject = await Subject.findOne({
            subCode: subjects[0].subCode,
            school: req.body.adminID,
        });

        if (existingSubject) {
            return res.status(400).send({ message: "Sorry, this subcode already exists" });
        }

        const result = await Subject.insertMany(subjects);

        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "CREATE_SUBJECT",
            target: "subject",
            details: `Subjects created: ${result.map(s => s.subName).join(", ")}`
        });

        res.status(201).send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= GET ALL =================
const allSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ school: req.params.id })
            .populate("classGroup", "name");

        if (!subjects.length) {
            return res.send({ message: "No subjects found" });
        }

        res.send(subjects);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= GET BY CLASS =================
const Sclass = require("../models/sclassSchema.js"); 

const classSubjects = async (req, res) => {
    try {
        const inputId = req.params.id;
        if (!inputId || inputId === "undefined") return res.status(400).json({ message: "No ID provided" });

        // Logic: Try finding by ClassGroup first, then check if ID is an Sclass
        let subjects = await Subject.find({ classGroup: inputId });

        if (subjects.length === 0) {
            const sclassSection = await Sclass.findById(inputId);
            if (sclassSection?.classGroup) {
                subjects = await Subject.find({ classGroup: sclassSection.classGroup });
            }
        }
        res.status(200).send(subjects);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// ================= FREE SUBJECTS =================
const freeSubjectList = async (req, res) => {
    try {
        const subjects = await Subject.find({
            classGroup: req.params.id
        });

        if (!subjects.length) {
            return res.send({ message: "No subjects found" });
        }

        res.send(subjects);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= DETAIL =================
const getSubjectDetail = async (req, res) => {
    try {
        let subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.send({ message: "No subject found" });
        }

        subject = await subject.populate("classGroup", "name");

        res.send(subject);

    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSubject = async (req, res) => {
    try {
        // 1. Find it first so we have the name for the audit log
        const subjectToDelete = await Subject.findById(req.params.id);
        if (!subjectToDelete) return res.send({ message: "Subject not found" });

        // 2. Cleanup references in Teachers (the new relational way)
        await Teacher.updateMany(
            { "assignments.subject": req.params.id },
            { $pull: { assignments: { subject: req.params.id } } }
        );

        // 3. Cleanup Student marks/attendance
        await Student.updateMany(
            {},
            { $pull: { 
                examResult: { subName: req.params.id }, 
                attendance: { subName: req.params.id } 
            }}
        );

        // 4. Finally delete the subject
        await Subject.findByIdAndDelete(req.params.id);

        // 5. Audit the action
        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "DELETE_SUBJECT",
            target: "subject",
            targetId: req.params.id,
            details: `Subject '${subjectToDelete.subName}' deleted and all relations cleared.`
        });

        res.send(subjectToDelete);
    } catch (error) {
        res.status(500).json(error);
    }
};

// ================= DELETE ALL =================
const deleteSubjects = async (req, res) => {
    try {
        const result = await Subject.deleteMany({ school: req.params.id });

        if (!result.deletedCount) {
            return res.send({ message: "No subjects found to delete" });
        }

       await Teacher.updateMany(
    { teachSclass: req.params.id },
    { $unset: { teachSubject: "" } }
);

        await Student.updateMany({}, { $set: { examResult: [], attendance: [] } });

            await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "DELETE_ALL_SUBJECTS",
            target: "subject",
            details: `Bulk delete performed: ${result.deletedCount} subjects removed`
        });

        res.send(result);

    } catch (error) {
        res.status(500).json(error);
    }
};

// ================= DELETE BY CLASS =================
const deleteSubjectsByClass = async (req, res) => {
    try {
        const subjects = await Subject.find({ classGroup: req.params.id });
        const subjectIds = subjects.map(s => s._id);

        if (subjectIds.length === 0) return res.send({ message: "No subjects found" });

        // Pull all these subjects from all teachers
        await Teacher.updateMany(
            { "assignments.subject": { $in: subjectIds } },
            { $pull: { assignments: { subject: { $in: subjectIds } } } }
        );

        await Subject.deleteMany({ _id: { $in: subjectIds } });

        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "DELETE_CLASS_SUBJECTS",
            target: "subject",
            details: `Cleared ${subjectIds.length} subjects for class group ${req.params.id}`
        });

        res.send({ message: "Subjects deleted" });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    subjectCreate,
    freeSubjectList,
    classSubjects,
    getSubjectDetail,
    deleteSubjectsByClass,
    deleteSubjects,
    deleteSubject,
    allSubjects
};