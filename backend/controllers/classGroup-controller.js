const ClassGroup = require("../models/classGroupSchema.js");
const Sclass = require("../models/sclassSchema.js");
const Subject = require("../models/subjectSchema.js");
const Student = require("../models/studentSchema.js");
const Teacher = require("../models/teacherSchema.js");
const { audit } = require("../utils/audit.js");

// ================= CREATE =================
const createClassGroup = async (req, res) => {
    try {
        const { name, adminID } = req.body;

        const existing = await ClassGroup.findOne({ name, school: adminID });
        if (existing) {
            return res.status(400).json({ message: "Class group already exists" });
        }

        const classGroup = new ClassGroup({ name, school: adminID });
        const result = await classGroup.save();

        await audit(req, {
            userId: adminID,
            userName: "Admin",
            userRole: "admin",
            action: "CREATE_CLASS_GROUP",
            target: "classGroup",
            targetId: result._id,
            details: `Class ${name} created`
        });

        res.json(result);
        console.log("THUNK RESULT.DATA:", result.data);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= LIST =================
const listClassGroups = async (req, res) => {
    try {
        const groups = await ClassGroup.find({ school: req.params.id }).lean();
        res.json(groups);
    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= DETAIL =================
const getClassGroupDetail = async (req, res) => {
    try {
        const group = await ClassGroup.findById(req.params.id).lean();
        if (!group) return res.json({ message: "Class group not found" });
        res.json(group);
    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= DELETE =================
const deleteClassGroup = async (req, res) => {
    try {
        const deleted = await ClassGroup.findByIdAndDelete(req.params.id);
        if (!deleted) return res.json({ message: "Class group not found" });

        // Cascade
        const sections = await Sclass.find({ classGroup: req.params.id }).lean();
        const sectionIds = sections.map(s => s._id);

        await Promise.all([
            Sclass.deleteMany({ classGroup: req.params.id }),
            Subject.deleteMany({ classGroup: req.params.id }),
            Student.deleteMany({ sclassName: { $in: sectionIds } }),
            Teacher.deleteMany({ teachSclass: { $in: sectionIds } }),
        ]);

        await audit(req, {
            userId: req.body.adminID,
            userName: "Admin",
            userRole: "admin",
            action: "DELETE_CLASS_GROUP",
            target: "classGroup",
            targetId: req.params.id,
            details: `Class ${deleted.name} and all related data deleted`
        });

        res.json(deleted);

    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    createClassGroup,
    listClassGroups,
    getClassGroupDetail,
    deleteClassGroup
};