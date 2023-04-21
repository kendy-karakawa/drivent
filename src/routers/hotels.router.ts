import { Router } from 'express';
import { getAllHotels, getHotelRooms } from '@/controllers';
import { authenticateToken, validateParams } from '@/middlewares';
import { hotelIdSchema } from '@/schemas';

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getAllHotels)
  .get('/:hotelId', validateParams(hotelIdSchema), getHotelRooms);

export { hotelsRouter };
