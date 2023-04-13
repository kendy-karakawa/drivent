import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTickets();
}

async function getUserTickets(id: number): Promise<Ticket> {
  const ticket = await ticketsRepository.getUserTickets(id);
  if (!ticket) throw notFoundError();

  return ticket;
}

const ticketsService = {
  getAllTickets,
  getUserTickets,
};

export default ticketsService;
