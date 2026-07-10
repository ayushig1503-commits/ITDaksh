const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const { audit } = require('../utils/audit.js'); 

// ================= REGISTER =================
const adminRegister = async (req, res) => {
    try {
        const existingAdminByEmail = await Admin.findOne({ email: req.body.email });
        const existingSchool = await Admin.findOne({ schoolName: req.body.schoolName });

        if (existingAdminByEmail) {
            return res.send({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            return res.send({ message: 'School name already exists' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const admin = new Admin({
            ...req.body,
            password: hashedPassword
        });

        let result = await admin.save();

        await audit(req, {
            userId: result._id,
            userName: result.email, 
            userRole: "admin",
            action: "REGISTER_ADMIN",
            target: "admin",
            targetId: result._id,
            details: `Admin registered`,
        });

        result.password = undefined;
        res.send(result);

    } catch (err) {
        res.status(500).json(err);
    }
};

// ================= LOGIN =================
const adminLogIn = async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    if (!email || !password) {
        return res.send({ message: "Email and password are required" });
    }

    try {
        let admin = await Admin.findOne({ email });

        if (!admin) {
                await audit(req, {
                userId: null,
                userRole: "admin",
                action: "LOGIN_FAILURE",
                target: "auth",
                details: "Login failed: Account not found",
            });
            return res.send({ message: "User not found" });
        }

        const isHashed = admin.password && admin.password.startsWith('$2b$');

        let isMatch = false;

        if (isHashed) {
            isMatch = await bcrypt.compare(password, admin.password);
        } else {
            // legacy plaintext
            isMatch = (password === admin.password);

            if (isMatch) {
                const newHash = await bcrypt.hash(password, 10);
                admin.password = newHash;
                await admin.save();
            }
        }

        if (isMatch) {
            await audit(req, {
                userId: admin._id,
                userName: admin.email,
                userRole: "admin",
                action: "LOGIN_SUCCESS",
                target: "auth",
                targetId: admin._id,
                details: "Login successful",
            });

            admin.password = undefined;
            res.send(admin);

        } else {
                await audit(req, {
                userId: admin._id,
                userRole: "admin",
                action: "LOGIN_FAILURE",
                target: "auth",
                targetId: admin._id,
                details: "Login failed: Incorrect password",
            });

            res.send({ message: "Invalid password" });
        }

    } catch (err) {
        res.status(500).json({ message: "Server error during login" });
    }
};

// ================= GET =================
const getAdminDetail = async (req, res) => {
    try {
        let admin = await Admin.findById(req.params.id);

        if (admin) {
            admin.password = undefined;
            res.send(admin);
        } else {
            res.send({ message: "No admin found" });
        }

    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };