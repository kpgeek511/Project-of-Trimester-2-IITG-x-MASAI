const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: [true, 'Patient ID is required'],
    unique: true,
    validate: {
      validator: v => /^PAT-\d{4}$/.test(v),
      message: 'Patient ID must be in PAT-XXXX format'
    }
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age seems unrealistic']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  contactInfo: {
    type: String,
    required: [true, 'Contact information is required']
  },
  allergies: {
    type: [String],
    default: []
  },
  medicalHistory: {
    type: [String],
    default: []
  },
  currentPrescriptions: {
    type: [String],
    default: []
  },
  doctorNotes: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Patient', patientSchema);