import { Response } from 'express';
import httpStatus from 'http-status';
import paymentsService from '@/services/payments-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const id = req.query.ticketId;

  const ticketId = Number(id);

  try {
    const payment = await paymentsService.getPaymentInfo(userId, ticketId);
    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    if (error.name === 'UnauthorizedError') return res.status(httpStatus.UNAUTHORIZED).send(error.message);

    return res.sendStatus(500);
  }
}
