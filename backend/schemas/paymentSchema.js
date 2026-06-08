const Joi = require('joi');

const selectedModuleSchema = Joi.object({
  moduleId:   Joi.number().required(),
  moduleName: Joi.string().required(),
  termId:     Joi.number().allow(null).default(null),
  termName:   Joi.string().allow(null, '').default(null),
  fee:        Joi.number().min(0).required()
});

const paymentSchema = Joi.object({
  modules:    Joi.array().items(selectedModuleSchema).min(1).required(),
  subTotal:   Joi.number().min(1).required(),
  grandTotal: Joi.number().min(1).required(),
  utrNumber:  Joi.string().pattern(/^[0-9]{12}$/).required().messages({
    'string.pattern.base': 'UTR must be exactly 12 digits (e.g. 407612345678)'
  }),
  paymentDate: Joi.date().max('now').required().messages({
    'date.max': 'Payment date cannot be in the future',
    'any.required': 'Date of payment is required'
  })
});

module.exports = { paymentSchema };
