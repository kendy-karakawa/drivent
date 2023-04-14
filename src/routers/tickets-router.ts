import { Router } from 'express';
import { getAllTickets, getUserTickets, postTicket } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { ticketTypeIdSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getAllTickets);
ticketsRouter.get('/', authenticateToken, getUserTickets);
ticketsRouter.post('/', authenticateToken, validateBody(ticketTypeIdSchema), postTicket);

export { ticketsRouter };
