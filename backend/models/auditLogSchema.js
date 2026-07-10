// models/auditLogSchema.js

const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    default: null,
    immutable: true,
  },

  userRole: {
    type: String,
    immutable: true,
  },

  action: {
    type: String,
    required: true,
    immutable: true,
  },

  target: {
    type: String,
    immutable: true,
  },

  targetId: {
    type: String,
    immutable: true,
  },

  details: {
    type: String,
    immutable: true,
  },

  ip: {
    type: String,
    immutable: true,
  },
});

auditLogSchema.pre("findOneAndUpdate", function () {
  throw new Error("Audit logs are append-only");
});

auditLogSchema.pre("updateOne", function () {
  throw new Error("Audit logs are append-only");
});

auditLogSchema.pre("updateMany", function () {
  throw new Error("Audit logs are append-only");
});

auditLogSchema.pre("findOneAndDelete", function () {
  throw new Error("Audit logs cannot be deleted");
});

auditLogSchema.pre("deleteOne", function () {
  throw new Error("Audit logs cannot be deleted");
});

auditLogSchema.pre("deleteMany", function () {
  throw new Error("Audit logs cannot be deleted");
});

module.exports = mongoose.model("AuditLog", auditLogSchema);