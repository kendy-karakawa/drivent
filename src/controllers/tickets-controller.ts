import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { TicketType } from '@prisma/client';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { UserTicket } from '@/protocols';

export async function getAllTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const ticket: TicketType[] = await ticketsService.getAllTickets();

    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    next(error);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const id: number = req.userId;
  try {
    const ticket: UserTicket = await ticketsService.getUserTickets(id);
    res.status(httpStatus.OK).send(ticket);
  } catch (error) {
    next(error);
  }
}

export async function postTicket(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const ticketTypeId: number = req.body.ticketTypeId;
  const id: number = req.userId;

  try {
    const ticket: UserTicket = await ticketsService.postTicket(ticketTypeId, id);
    res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    next(error);
  }
}
