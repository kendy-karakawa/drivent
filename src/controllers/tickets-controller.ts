import { Response } from 'express';
import httpStatus from 'http-status';
import { TicketType } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { UserTicket } from '@/protocols';

export async function getAllTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const ticket: TicketType[] = await ticketsService.getAllTickets();

    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const id: number = req.userId;
  try {
    const ticket: UserTicket = await ticketsService.getUserTickets(id);
    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return res.sendStatus(500);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId: number = req.body.ticketTypeId;
  const id: number = req.userId;

  try {
    const ticket: UserTicket = await ticketsService.postTicket(ticketTypeId, id);
    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    return res.sendStatus(500);
  }
}
