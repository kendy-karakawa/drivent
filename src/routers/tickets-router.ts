import { Router } from 'express';
import { getAllTickets } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTickets);

export { ticketsRouter };
