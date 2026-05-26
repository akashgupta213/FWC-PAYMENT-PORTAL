const Joi = require('joi');

const registerSchema = Joi.object({
  name:     Joi.string().min(2).max(100).required(),
  cometId:  Joi.string().alphanum().min(3).max(20).required(),
  email:    Joi.string().email().required(),
  contact:  Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Contact must be a 10-digit number'
  }),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  cometId:  Joi.string().required(),
  password: Joi.string().required(),
  adminCode: Joi.string().allow('').optional()
});

module.exports = { registerSchema, loginSchema };