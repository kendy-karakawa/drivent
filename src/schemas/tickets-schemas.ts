import Joi from 'joi';

export const ticketTypeIdSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});

export const ticketIdSchema = Joi.object({
  ticketId: Joi.number().required(),
});
