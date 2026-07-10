const AuditLog = require("../models/auditLogSchema.js");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(200)
      .populate("userId", "name email role");
      
    console.log("Sample log userId:", JSON.stringify(logs[0]?.userId));
    console.log("Logs type:", typeof logs);
    console.log("Is array:", Array.isArray(logs));
    console.log("First log:", logs[0]);

    res.send(logs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

module.exports = { getAuditLogs };