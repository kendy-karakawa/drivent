import { Router } from 'express';
import { getPaymentInfo } from '@/controllers';
import { authenticateToken, validateQuery } from '@/middlewares';
import { ticketIdSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, validateQuery(ticketIdSchema), getPaymentInfo);

export { paymentsRouter };
