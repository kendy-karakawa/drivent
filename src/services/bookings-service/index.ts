import hotelsService from '../hotels-service';
import bookingsRepository from '@/repositories/bookings-repository/indes';
import roomsRepository from '@/repositories/rooms-repository';
import { notFoundError, unauthorizedError, unavailableRoomError } from '@/errors';

async function avaliabeRoom(roomId: number) {
  const room = await roomsRepository.getRoom(roomId);
  if (!room) throw notFoundError();
  const roomsBooked = await bookingsRepository.countRoomsBooked(roomId);
  if (room.capacity === roomsBooked) throw unavailableRoomError();
}

async function postBooking(userId: number, roomId: number) {
  await hotelsService.listHotels(userId);
  await avaliabeRoom(roomId);

  const booking = await bookingsRepository.postBooking(userId, roomId);
  return booking;
}

async function getBooking(userId: number) {
  const booking = await bookingsRepository.getBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  const booking = await bookingsRepository.getBooking(userId);
  if (!booking) throw unauthorizedError();

  await avaliabeRoom(roomId);

  const updatedBooking = await bookingsRepository.updateBooking(bookingId, roomId);
  return updatedBooking;
}

const bookingsService = {
  postBooking,
  getBooking,
  updateBooking,
};

export default bookingsService;
