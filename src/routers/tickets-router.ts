import { Router } from 'express';
import { getAllTickets, getUserTickets } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTickets);
ticketsRouter.get('/', authenticateToken, getUserTickets);

export { ticketsRouter };
