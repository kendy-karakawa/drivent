import { Router } from 'express';
import { getBooking, postBooking, updateBooking } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken).post('/', postBooking).get('/', getBooking).put('/:bookingId', updateBooking);

export { bookingRouter };
