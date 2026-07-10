const mongoose = require("mongoose");

const Sclass = require("../models/sclassSchema");
const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");

const { audit } = require("../utils/audit");

const sclassCreate = async (req, res) => {
    try {
        const {
            sclassName,
            sectionName,
            adminID,
            classGroup,
            capacity
        } = req.body;

        const existing = await Sclass.findOne({
            sclassName,
            sectionName,
            school: adminID
        });

        if (existing) {
            return res.status(400).json({
                message: "Section already exists"
            });
        }

        const sclass = new Sclass({
            sclassName,
            sectionName,
            school: adminID,
            classGroup,
            capacity: capacity || 40
        });

        const result = await sclass.save();
        res.status(201).send(result);

    } catch (err) {
        console.error("DEBUG: Create Error ->", err.message);
        res.status(500).json({ error: err.message });
    }
};

const sclassList = async (req, res) => {
    try {
        const inputId = req.params.id;
        const today = new Date().toLocaleDateString("en-CA");

console.log("TODAY STRING:", today);

        const isClassGroup = await mongoose.model("classGroup").exists({ _id: inputId });

        const matchQuery = isClassGroup
            ? { classGroup: new mongoose.Types.ObjectId(inputId) }
            : { school: new mongoose.Types.ObjectId(inputId) };

        const sclasses = await Sclass.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: "classgroups",
                    localField: "classGroup",
                    foreignField: "_id",
                    as: "classGroup"
                }
            },
            {
                $unwind: {
                    path: "$classGroup",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "sclassName",
                    as: "students"
                }
            },
            {
                $addFields: {
                    studentCount: { $size: "$students" },

                    // students present today
                    presentToday: {
                        $size: {
                            $filter: {
                                input: "$students",
                                as: "student",
                                cond: {
                                    $gt: [
                                        {
                                            $size: {
                                                $filter: {
                                                    input: { $ifNull: ["$$student.attendance", []] },
                                                    as: "attendance",
                                                    cond: {
                                                        $and: [
                                                            { $eq: ["$$attendance.date", today] },
                                                            { $eq: ["$$attendance.status", "Present"] }
                                                        ]
                                                    }
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    },

                    // total present records across all students in section
                    totalPresent: {
                        $reduce: {
                            input: "$students",
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    {
                                        $size: {
                                            $filter: {
                                                input: { $ifNull: ["$$this.attendance", []] },
                                                as: "a",
                                                cond: { $eq: ["$$a.status", "Present"] }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },

                    // total attendance records across all students in section
                    totalRecords: {
                        $reduce: {
                            input: "$students",
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    { $size: { $ifNull: ["$$this.attendance", []] } }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    attendanceYTD: {
                        $cond: {
                            if: { $eq: ["$totalRecords", 0] },
                            then: 0,
                            else: {
                                $round: [
                                    {
                                        $multiply: [
                                            { $divide: ["$totalPresent", "$totalRecords"] },
                                            100
                                        ]
                                    },
                                    1
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    sclassName: 1,
                    sectionName: 1,
                    capacity: 1,
                    classGroup: {
                        _id: "$classGroup._id",
                        name: "$classGroup.name"
                    },
                    studentCount: 1,
                    presentToday: 1,
                    attendanceYTD: 1
                }
            }
        ]);

        res.status(200).json(sclasses);

    } catch (err) {
        console.error("CRITICAL BACKEND ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

const getSclassDetail = async (req, res) => {
    try {
        const sclass = await Sclass.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("classGroup", "name");

        if (!sclass) {
            return res.send({ message: "Class not found" });
        }

        res.send(sclass);

    } catch (err) {
        res.status(500).json(err);
    }
};

const getSclassStudents = async (req, res) => {
    try {
        const students = await Student.find({
            sclassName: req.params.id
        }).lean();

        res.json(
            students.map((s) => ({
                ...s,
                password: undefined
            }))
        );

    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteSclass = async (req, res) => {
    try {
        const sclass = await Sclass.findById(req.params.id);
        if (!sclass) return res.send({ message: "Class not found" });

        const targetName = sclass.sclassName;

        const [deletedClass, studentCount, teacherCount] = await Promise.all([
            Sclass.findByIdAndDelete(req.params.id),
            Student.deleteMany({ sclassName: req.params.id }),
            Teacher.deleteMany({ teachSclass: req.params.id })
        ]);

        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "DELETE_CLASS",
            target: "class",
            targetId: req.params.id,
            details: `Class '${targetName}' deleted (Purged: ${studentCount.deletedCount} students, ${teacherCount.deletedCount} teachers)`
        });

        res.send(deletedClass);

    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteSclasses = async (req, res) => {
    try {
        const deletedClasses = await Sclass.deleteMany({
            school: req.params.id
        });

        if (!deletedClasses.deletedCount) {
            return res.json({ message: "No classes found to delete" });
        }

        const [studentCount, teacherCount] = await Promise.all([
            Student.deleteMany({ school: req.params.id }),
            Teacher.deleteMany({ school: req.params.id })
        ]);

        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "DELETE_ALL_CLASSES",
            target: "school",
            targetId: req.params.id,
            details: `Full reset performed: Deleted ${deletedClasses.deletedCount} classes, ${studentCount.deletedCount} students, and ${teacherCount.deletedCount} teachers`
        });

        res.send(deletedClasses);

    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    sclassCreate,
    sclassList,
    deleteSclass,
    deleteSclasses,
    getSclassDetail,
    getSclassStudents
};