const bcrypt = require('bcrypt');
const Admin = require('../models/adminSchema.js');
const { audit } = require('../utils/audit.js'); 

// ================= REGISTER =================
const adminRegister = async (req, res) => {
    try {
        const { name, email, password, schoolName } = req.body;

        // CRITICAL FIX: Block blank fields from reaching the database
        if (!name || !email || !password || !schoolName) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingAdminByEmail = await Admin.findOne({ email });
        const existingSchool = await Admin.findOne({ schoolName });

        // CRITICAL FIX: Added .status(400) to stop frontend from thinking this is a success
        if (existingAdminByEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        else if (existingSchool) {
            return res.status(400).json({ message: 'School name already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

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
        res.status(201).send(result);

    } catch (err) {
        res.status(500).json({ message: "Server error during registration", error: err.message });
    }
};

// ================= LOGIN =================
const adminLogIn = async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    // CRITICAL FIX: Shifted to status 400
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        let admin = await Admin.findOne({ email });

        // CRITICAL FIX: Shifted to status 404
        if (!admin) {
            await audit(req, {
                userId: null,
                userRole: "admin",
                action: "LOGIN_FAILURE",
                target: "auth",
                details: "Login failed: Account not found",
            });
            return res.status(404).json({ message: "User not found" });
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

            // CRITICAL FIX: Shifted to status 401 Unauthorized
            res.status(401).json({ message: "Invalid password" });
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
            res.status(404).json({ message: "No admin found" });
        }

    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };