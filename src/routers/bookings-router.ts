import { Router } from 'express';
import { getBooking, postBooking, updateBooking } from '@/controllers';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { bookingIdSchema, roomIdSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .use(authenticateToken)
  .post('/', validateBody(roomIdSchema), postBooking)
  .get('/', getBooking)
  .put('/:bookingId', validateParams(bookingIdSchema), validateBody(roomIdSchema), updateBooking);

export { bookingRouter };
