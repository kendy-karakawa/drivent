import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { TicketType } from '@/protocols';

export async function getAllTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const ticket: TicketType[] = await ticketsService.getAllTickets();

    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(500);
  }
}
