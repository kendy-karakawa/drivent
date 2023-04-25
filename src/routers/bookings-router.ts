import { Router } from 'express';
import { getBooking, postBooking } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();

bookingRouter.use(authenticateToken).post('/', postBooking).get('/', getBooking);

export { bookingRouter };
