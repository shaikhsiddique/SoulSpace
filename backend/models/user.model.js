const mongoose = require('mongoose');
const Joi = require('joi');

// -------- TEST SUB-SCHEMA --------
const testSchema = new mongoose.Schema(
  {
    sentiment: {
      type: String,
      required: true,
    },
    emotion: {
      type: String,
      required: true,
    },
    risk_level: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'emergency'],
    },
    topics: {
      type: [String],
      required: true,
      default: [],
    },
    summary: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now, // timestamp
    },
    // Store original assessment data for reference
    selectedDomain: {
      type: String,
      required: false,
    },
  },
  { _id: true, timestamps: false }
);

// -------- JOURNAL SUB-SCHEMA --------
const journalSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true, timestamps: false }
);

// -------- USER SCHEMA --------
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required.'],
    },
    phone: {
      type: Number,
      unique: true,
      required: [true, 'Phone number is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required.'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required.'],
    },

    // ---- TEST ARRAY (multiple tests) ----
    tests: {
      type: [testSchema],
      default: [],
    },

    // ---- JOURNAL ENTRIES (optional) ----
    journals: {
      type: [journalSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// -------- UNIQUE ERROR HANDLING --------
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    if (error.keyPattern.email) {
      next(new Error('Email must be unique. The provided email is already in use.'));
    } else if (error.keyPattern.phone) {
      next(new Error('Phone number must be unique. The provided phone number is already in use.'));
    } else {
      next(new Error('A unique constraint violation occurred.'));
    }
  } else {
    next(error);
  }
});

// -------- JOI VALIDATION --------
const validateUserModel = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
    password: Joi.string().min(6).required(),

    // Added age & gender validation
    age: Joi.number().min(1).max(120).required().messages({
      "number.base": "Age must be a number.",
      "any.required": "Age is required.",
    }),

    gender: Joi.string().valid('male', 'female', 'other').required().messages({
      "any.only": "Gender must be male, female, or other.",
      "any.required": "Gender is required.",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

const userModel = mongoose.model('User', userSchema);
module.exports = { userModel, validateUserModel };
