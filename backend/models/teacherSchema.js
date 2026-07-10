const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subject",
    required: true,
  },

  sclass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "sclass",
    required: true,
  },

  assignedAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "Teacher",
  },

  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },

  assignments: [assignmentSchema],

attendance: [{
    date: Date,
    status: String
}]
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema);