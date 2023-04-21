import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getAllHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId: number = req.userId;
  try {
    const hotels = await hotelsService.getAllHotels(userId);
    res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}