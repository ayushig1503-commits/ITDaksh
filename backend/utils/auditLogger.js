const AuditLog = require("../models/auditLogSchema");
const crypto = require("crypto");

const GENESIS_HASH = "GENESIS";

const logAction = async ({
  req,
  userId, // Manual override
  userRole,
  action,
  target,
  targetId,
  details,
}) => {
  try {
  
    const finalUserId = userId || req.user?._id || req.admin?._id || null;
    const finalRole = userRole || req.user?.role || "admin";

    const ip = req?.headers["x-forwarded-for"] || req?.connection?.remoteAddress || "UNKNOWN";

    const normalizedUserId = userId || null;

    const prevLog = await AuditLog.findOne().sort({ timestamp: -1 });

    const prevHash = prevLog ? prevLog.hash : GENESIS_HASH;

    const timestamp = new Date();

    const dataString =
      `${timestamp.toISOString()}|` +
      `${normalizedUserId}|` +
      `${userRole}|` +
      `${action}|` +
      `${target}|` +
      `${targetId}|` +
      `${ip}|` +
      `${details}|` +
      `${prevHash}`;

    const hash = crypto
      .createHash("sha256")
      .update(dataString)
      .digest("hex");

const log = new AuditLog({
      timestamp,
      userId: finalUserId, 
      userRole: finalRole,
      action,
      target,
      targetId,
      ip,
      details,
      prevHash,
      hash,
    });

    await log.save();
  } catch (err) {
    console.error("Audit log failed:", err);
  }
};

module.exports = { logAction };