import { Router } from 'express';
import { getBooking, postBooking, updateBooking } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { roomIdSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .use(authenticateToken)
  .post('/', validateBody(roomIdSchema), postBooking)
  .get('/', getBooking)
  .put('/:bookingId', validateBody(roomIdSchema), updateBooking);

export { bookingRouter };
