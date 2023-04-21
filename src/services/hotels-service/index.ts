import { TicketStatus } from '@prisma/client';
import { notFoundError, paymentRequiredError } from '@/errors';
import { UserTicket } from '@/protocols';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getAllHotels(userId: number) {
  const ticket: UserTicket = await ticketsRepository.getUserTickets(userId);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();
  if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
  if (ticket.status === TicketStatus.RESERVED) throw paymentRequiredError();

  const hotels = await hotelsRepository.getAllHotels();

  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number) {
  const ticket: UserTicket = await ticketsRepository.getUserTickets(userId);
  if (!ticket) throw notFoundError();
  if (ticket.TicketType.includesHotel === false) throw paymentRequiredError();
  if (ticket.TicketType.isRemote === true) throw paymentRequiredError();
  if (ticket.status === TicketStatus.RESERVED) throw paymentRequiredError();

  const rooms = await hotelsRepository.getHotelRooms(hotelId);
  if (!rooms) throw notFoundError();

  return rooms;
}

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
