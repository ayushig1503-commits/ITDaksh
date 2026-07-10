const Notice = require('../models/noticeSchema.js');

const noticeCreate = async (req, res) => {
    try {
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID // Maps frontend adminID to schema school field
        });
        const result = await notice.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const noticeList = async (req, res) => {
    try {
        // Sort by date descending so newest announcements appear first in the table
        let notices = await Notice.find({ school: req.params.id }).sort({ date: -1 });
        
        if (notices.length > 0) {
            res.send(notices);
        } else {
            // Return an empty array instead of just a message object 
            // to prevent .map() errors on the frontend
            res.send([]); 
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteNotice = async (req, res) => {
    try {
        const result = await Notice.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        // Fixed: changed 'err' to 'error' to match the catch block variable
        res.status(500).json(error); 
    }
};

const deleteNotices = async (req, res) => {
    try {
        const result = await Notice.deleteMany({ school: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No notices found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        // Fixed: changed 'err' to 'error'
        res.status(500).json(error);
    }
};

module.exports = { noticeCreate, noticeList, updateNotice, deleteNotice, deleteNotices };