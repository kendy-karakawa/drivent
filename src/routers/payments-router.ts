import { Router } from 'express';
import { getPaymentInfo, postPayment } from '@/controllers';
import { authenticateToken, validateBody, validateQuery } from '@/middlewares';
import { paymentSchema, ticketIdSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, validateQuery(ticketIdSchema), getPaymentInfo);
paymentsRouter.post('/process', authenticateToken, validateBody(paymentSchema), postPayment);

export { paymentsRouter };
