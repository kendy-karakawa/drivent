import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { Payment } from '@prisma/client';
import paymentsService from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const id = req.query.ticketId;

  const ticketId = Number(id);

  try {
    const payment: Payment = await paymentsService.getPaymentInfo(userId, ticketId);
    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId;
  const { ticketId, cardData } = req.body;

  try {
    const payment = await paymentsService.postPayment(userId, ticketId, cardData);

    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}
