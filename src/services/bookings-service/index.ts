import hotelsService from '../hotels-service';
import bookingsRepository from '@/repositories/bookings-repository/indes';
import roomsRepository from '@/repositories/rooms-repository';
import { notFoundError, unavailableRoomError } from '@/errors';

async function postBooking(userId: number, roomId: number) {
  await hotelsService.listHotels(userId);

  const room = await roomsRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  const roomsBooked = await bookingsRepository.countRoomsBooked(roomId);
  if (room.capacity === roomsBooked) throw unavailableRoomError();

  const booking = await bookingsRepository.postBooking(userId, roomId);
  return booking;
}

async function getBooking(userId: number) {
  const booking = await bookingsRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

const bookingsService = {
  postBooking,
  getBooking,
};

export default bookingsService;
