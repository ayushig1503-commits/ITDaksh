const mongoose = require('mongoose');

const sclassSchema = new mongoose.Schema({
  sclassName: {
    type: String,
    required: true,
  },

  sectionName: {
    type: String,
    required: true,
  },

  capacity: {
    type: Number,
    default: 40
  },

  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin'
  },

  classGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'classGroup',
    required: true,
  },

  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "student"
  }]

}, { timestamps: true });

module.exports = mongoose.model("sclass", sclassSchema);