import { Booking } from '@prisma/client';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import bookingsService from '@/services/bookings-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function postBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const roomId = req.body.roomId as number;
  try {
    const booking: Booking = await bookingsService.postBooking(userId, roomId);

    res.status(httpStatus.OK).send({ bookinId: booking.id });
  } catch (error) {
    next(error);
  }
}

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  try {
    const booking = await bookingsService.getBooking(userId);

    res.status(httpStatus.OK).send({ id: booking.id, Room: booking.Room });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const bookingId = Number(req.params.bookingId) as number;
  const roomId = req.body.roomId as number;
  console.log('entrei');
  try {
    const booking: Booking = await bookingsService.updateBooking(userId, bookingId, roomId);
    res.status(httpStatus.OK).send({ bookinId: booking.id });
  } catch (error) {
    next(error);
  }
}
