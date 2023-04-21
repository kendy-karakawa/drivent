import Joi from 'joi';

export const hotelIdSchema = Joi.object({
  ticketId: Joi.number().required(),
});
