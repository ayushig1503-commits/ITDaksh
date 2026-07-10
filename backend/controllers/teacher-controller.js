const bcrypt = require("bcrypt");
const Teacher = require("../models/teacherSchema.js");
const Subject = require("../models/subjectSchema.js");
const { audit } = require("../utils/audit.js"); 

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, assignments } = req.body;

    try {
        const existingTeacherByEmail = await Teacher.findOne({ email });
        if (existingTeacherByEmail) {
            return res.status(400).send({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const teacher = new Teacher({
            name,
            email,
            password: hashedPass,
            role,
            school,
            assignments: assignments || [] 
        });

        const result = await teacher.save();

        await audit(req, {
            userId: req.body.adminID || school || null,
            userName: "Admin",
            userRole: "admin",
            action: "ADD_TEACHER",
            target: "teacher",
            targetId: result._id,
            details: `Teacher ${result.name} created with ${result.assignments.length} initial assignments`
        });

        result.password = undefined;
        res.status(201).send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (!teacher) return res.status(404).send({ message: "Teacher not found" });

        const validated = await bcrypt.compare(req.body.password, teacher.password);
        if (!validated) return res.status(401).send({ message: "Invalid password" });

        await audit(req, {
            userId: teacher._id,
            userName: teacher.name,
            userRole: "teacher",
            action: "LOGIN_SUCCESS",
            target: "auth",
            targetId: teacher._id,
            details: "Teacher logged in"
        });

        teacher = await teacher
            .populate("school", "schoolName")
            .populate("assignments.subject", "subName sessions")
            .populate("assignments.sclass", "sclassName sectionName")
            .execPopulate(); 

        teacher.password = undefined;
        res.send(teacher);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({ school: req.params.id })
            .populate("assignments.subject", "subName")
            .populate("assignments.sclass", "sclassName sectionName")
            .select("-password");

        if (!teachers.length) return res.send({ message: "No teachers found" });
        res.send(teachers);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("teachSubject", "subName sessions")
            .populate("school", "schoolName")
            .populate("teachSclass", "sclassName");

        if (!teacher) {
            return res.send({ message: "No teacher found" });
        }

        teacher.password = undefined;
        res.send(teacher);

    } catch (err) {
        res.status(500).json(err);
    }
};

// update
const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { teachSubject },
            { new: true }
        );


        const subjectDoc = await Subject.findById(teachSubject);
        const subjectName = subjectDoc ? subjectDoc.subName : "Unknown Subject";

        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "UPDATE_TEACHER_SUBJECT",
            target: "teacher",
            targetId: teacherId,
            details: `Assigned subject '${subjectName}' to teacher: ${updatedTeacher.name}`
        });

        res.send(updatedTeacher);

    } catch (error) {
        res.status(500).json(error);
    }
};

const addTeacherAssignment = async (req, res) => {
    const { teacherId, subjectId, sclassId, adminID } = req.body;

    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) return res.status(404).send({ message: "Teacher not found" });

        // Check for duplicates
        const exists = teacher.assignments.find(
            a => a.subject.toString() === subjectId && a.sclass.toString() === sclassId
        );
        if (exists) return res.status(400).send({ message: "Assignment already exists" });

        teacher.assignments.push({ subject: subjectId, sclass: sclassId });
        const updatedTeacher = await teacher.save();

        // Fetch names for audit clarity
        const sub = await Subject.findById(subjectId);
        const cls = await Sclass.findById(sclassId);

        await audit(req, {
            userId: adminID || null,
            userRole: "admin",
            action: "UPDATE_TEACHER_ASSIGNMENT",
            target: "teacher",
            targetId: teacherId,
            details: `Assigned ${sub?.subName} to ${teacher.name} for section ${cls?.sclassName}-${cls?.sectionName}`
        });

        res.send(updatedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

// delete
const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
        if (deletedTeacher) {
            await audit(req, {
                userId: req.body.adminID || null,
                userRole: "admin",
                action: "DELETE_TEACHER",
                target: "teacher",
                targetId: req.params.id,
                details: `Teacher profile deleted: ${deletedTeacher.name}`
            });
        }
        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const result = await Teacher.deleteMany({ school: req.params.id });

        if (result.deletedCount > 0) {

            await audit(req, {
                userId: req.body.adminID || null,
                userName: "Admin",
                userRole: "admin",
                action: "DELETE_ALL_TEACHERS",
                target: "teacher",
                details: `Deleted ${result.deletedCount} teachers`
            });
        }

        res.send(
            result.deletedCount === 0
                ? { message: "No teachers found to delete" }
                : result
        );

    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const result = await Teacher.deleteMany({ teachSclass: req.params.id });

        if (result.deletedCount > 0) {

            await audit(req, {
                userId: req.body.adminID || null,
                userName: "Admin",
                userRole: "admin",
                action: "DELETE_CLASS_TEACHERS",
                target: "teacher",
                targetId: req.params.id,
                details: `Deleted ${result.deletedCount} teachers from class`
            });
        }

        res.send(
            result.deletedCount === 0
                ? { message: "No teachers found to delete" }
                : result
        );

    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date, adminID } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).send({ message: "Teacher not found" });

        const searchDate = new Date(date).toDateString();
        const existing = teacher.attendance.find(a => a.date.toDateString() === searchDate);

        if (existing) {
            existing.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        await teacher.save();

        await audit(req, {
            userId: adminID || null,
            userRole: "admin",
            action: "UPDATE_TEACHER_ATTENDANCE",
            target: "teacher",
            targetId: req.params.id,
            details: `Attendance marked as ${status} for ${teacher.name} on ${searchDate}`
        });

        res.send({ message: "Attendance updated" });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    addTeacherAssignment,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};