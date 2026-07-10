// utils/audit.js

const AuditLog = require("../models/auditLogSchema");

const audit = async (req, data) => {
  try {
    const actorId =
      req.user?._id ||
      req.admin?._id ||
      data.userId ||
      null;

    const ip =
      req?.headers["x-forwarded-for"] ||
      req?.connection?.remoteAddress ||
      req?.socket?.remoteAddress ||
      "UNKNOWN";

    await AuditLog.create({
      userId: actorId,
      userRole: data.userRole || req.user?.role || req.admin?.role || "admin",
      action: data.action,
      target: data.target,
      targetId: data.targetId,
      details: data.details,
      ip,
    });

  } catch (err) {
    console.error("Audit logging failed:", err);
  }
};

module.exports = { audit };