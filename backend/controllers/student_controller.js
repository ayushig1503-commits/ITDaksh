const bcrypt = require('bcrypt');
const Student = require('../models/studentSchema.js');
const Subject = require('../models/subjectSchema.js');
const { audit } = require('../utils/audit.js');

// ================= REGISTER =================
const studentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            return res.send({ message: 'Roll Number already exists' });
        }

        const student = new Student({
            ...req.body,
            school: req.body.adminID,
            password: hashedPass
        });

        const result = await student.save();

        await audit(req, {
            userId: req.body.adminID || null,
            userName: "Admin",
            userRole: "admin",
            action: "ADD_STUDENT",
            target: "student",
            targetId: result._id,
            details: `Student ${result.name} added`
        });

        result.password = undefined;
        res.send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= LOGIN =================
const studentLogIn = async (req, res) => {
    try {
        let student = await Student.findOne({
            rollNum: req.body.rollNum,
            name: req.body.studentName
        });

        if (!student) {
            return res.send({ message: "Student not found" });
        }

        const validated = await bcrypt.compare(req.body.password, student.password);

        if (!validated) {
            return res.send({ message: "Invalid password" });
        }

        await audit(req, {
            userId: student._id,
            userRole: "student",
            action: "LOGIN_SUCCESS",
            target: "auth",
            targetId: student._id,
            details: "Student login successful",
        });

        student = await student.populate("school", "schoolName");
        student = await student.populate("sclassName", "sclassName sectionName");

        student.password = undefined;
        student.examResult = undefined;
        student.attendance = undefined;

        res.send(student);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= GET =================
const getStudents = async (req, res) => {
    try {
        let students = await Student.find({ school: req.params.id })
            .populate("sclassName", "sclassName sectionName");

        if (students.length === 0) {
            return res.send({ message: "No students found" });
        }

        const modified = students.map(s => {
            const obj = s.toObject();
            delete obj.password;
            return obj;
        });

        res.send(modified);

    } catch (err) {
        res.status(500).json(err);
    }
};

const getStudentDetail = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("sclassName", "sclassName sectionName")
            .populate("examResult.subName", "subName")
            // REMOVE OR COMMENT OUT THIS LINE BELOW:
            // .populate("attendance.subName", "subName sessions"); 

        if (!student) return res.status(404).json({ message: "No student found" });

        const studentObject = student.toObject();
        delete studentObject.password;

        res.status(200).json(studentObject);
    } catch (err) {
        res.status(500).json({ message: "Migration Error", error: err.message });
    }
};


// ================= DELETE =================
const deleteStudent = async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);

        if (result) {
            await audit(req, {
                userId: req.body.adminID || null,
                userName: "Admin",
                userRole: "admin",
                action: "DELETE_STUDENT",
                target: "student",
                targetId: result._id,
                details: `Student ${result.name} deleted`
            });
        }

        res.send(result);

    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteStudents = async (req, res) => {
    try {
        const result = await Student.deleteMany({ school: req.params.id });

        if (result.deletedCount > 0) {
            await audit(req, {
                userId: req.body.adminID || null,
                userName: "Admin",
                userRole: "admin",
                action: "DELETE_ALL_STUDENTS",
                target: "student",
                targetId: req.params.id,
                details: `Deleted ${result.deletedCount} students`
            });
        }

        res.send(
            result.deletedCount === 0
                ? { message: "No students found to delete" }
                : result
        );

    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteStudentsByClass = async (req, res) => {
    try {
        const result = await Student.deleteMany({ sclassName: req.params.id });

        if (result.deletedCount > 0) {
            await audit(req, {
                userId: req.body.adminID || null,
                userName: "Admin",
                userRole: "admin",
                action: "DELETE_CLASS_STUDENTS",
                target: "student",
                targetId: req.params.id,
                details: `Deleted ${result.deletedCount} students from class`
            });
        }

        res.send(
            result.deletedCount === 0
                ? { message: "No students found to delete" }
                : result
        );

    } catch (error) {
        res.status(500).json(error);
    }
};

// ================= UPDATE =================
const updateStudent = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        // Populate here so the updated response contains the class name, not just ID
        let result = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate("sclassName", "sclassName sectionName").populate("school", "schoolName");

        if (!result) {
            return res.send({ message: "No student found" });
        }

        await audit(req, {
            userId: req.body.adminID || null,
            userName: "Admin",
            userRole: "admin",
            action: "UPDATE_STUDENT",
            target: "student",
            targetId: req.params.id,
            details: `Student ${result.name} updated`
        });

        const resultObject = result.toObject();
        delete resultObject.password;
        
        res.send(resultObject);

    } catch (error) {
        console.error("Error in updateStudent:", error);
        res.status(500).json(error);
    }
};

// ================= EXAM =================
const updateExamResult = async (req, res) => {
    const { subName, marksObtained, examType, term, maxMarks } = req.body;

    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.send({ message: 'Student not found' });

        const Subject = require('../models/subjectSchema'); 
        const subjectDoc = await Subject.findById(subName);
        const readableSubName = subjectDoc ? subjectDoc.subName : "Unknown Subject";

        let subjectEntry = student.examResult.find(
            r => r.subName.toString() === subName
        );

        if (!subjectEntry) {
            student.examResult.push({
                subName,
                marks: [{ term, examType, marksObtained, maxMarks }]
            });
        } else {
            const existingExam = subjectEntry.marks.find(
                m => m.examType === examType && m.term === term
            );

            if (existingExam) {
                existingExam.marksObtained = marksObtained;
                existingExam.maxMarks = maxMarks;
            } else {
                subjectEntry.marks.push({ term, examType, marksObtained, maxMarks });
            }
        }

        const result = await student.save();

        await audit(req, {
            userId: req.body.adminID || null,
            userRole: "admin",
            action: "UPDATE_EXAM_RESULT",
            target: "student",
            targetId: req.params.id,
            details: `Updated ${examType} marks for ${readableSubName} (${student.name})`
        });

        res.send(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error updating marks" });
    }
};

// ================= ATTENDANCE =================
const studentAttendance = async (req, res) => {
const { status, date } = req.body;

try {
    const student = await Student.findById(req.params.id);

    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }

    // Always work with a clean YYYY-MM-DD string, no Date object conversion
    const targetDate = date.slice(0, 10);

    const existingIndex = student.attendance.findIndex(a => {
        return a.date.slice(0, 10) === targetDate;
    });

    if (existingIndex !== -1) {
        student.attendance[existingIndex].status = status;
    } else {
        student.attendance.push({ date: targetDate, status });
    }

    // Sort as strings — YYYY-MM-DD sorts correctly alphabetically
    student.attendance.sort((a, b) =>
        b.date.slice(0, 10).localeCompare(a.date.slice(0, 10))
    );

    const result = await student.save();
    res.status(200).json(result);

} catch (error) {
    console.error("Attendance Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
}};
// ================= CLEANUP =================
const clearAllStudentsAttendanceBySubject = async (req, res) => {
    try {
        const result = await Student.updateMany(
            { 'attendance.subName': req.params.id },
            { $pull: { attendance: { subName: req.params.id } } }
        );
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllStudentsAttendance = async (req, res) => {
    try {
        const result = await Student.updateMany(
            { school: req.params.id },
            { $set: { attendance: [] } }
        );
        res.send({ message: "All attendance records cleared", result });
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendanceBySubject = async (req, res) => {
    try {
        const result = await Student.updateOne(
            { _id: req.params.id },
            { $pull: { attendance: { subName: req.body.subId } } }
        );
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeStudentAttendance = async (req, res) => {
    try {
        const result = await Student.updateOne(
            { _id: req.params.id },
            { $set: { attendance: [] } }
        );
        res.send({ message: "Student attendance reset", result });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    studentRegister,
    studentLogIn,
    getStudents,
    getStudentDetail,
    deleteStudent,
    deleteStudents,
    deleteStudentsByClass,
    updateStudent,
    updateExamResult,
    studentAttendance,
    clearAllStudentsAttendanceBySubject,
    clearAllStudentsAttendance,
    removeStudentAttendanceBySubject,
    removeStudentAttendance,
};