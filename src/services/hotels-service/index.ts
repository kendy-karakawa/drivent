import { Enrollment, TicketStatus } from '@prisma/client';
import { notFoundError, paymentRequiredError, unauthorizedError } from '@/errors';
import { UserTicket } from '@/protocols';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getAllHotels(userId: number) {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket: UserTicket = await ticketsRepository.getUserTickets(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();
  if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
  if (ticket.status === TicketStatus.RESERVED) throw paymentRequiredError();

  const hotels = await hotelsRepository.getAllHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number) {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const hotel = await hotelsRepository.getHotelById(hotelId);
  if (!hotel) throw notFoundError();

  const ticket: UserTicket = await ticketsRepository.getUserTickets(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();
  if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
  if (ticket.status === TicketStatus.RESERVED) throw paymentRequiredError();

  const hotelRooms = await hotelsRepository.getHotelRooms(hotelId);

  return hotelRooms;
}

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
