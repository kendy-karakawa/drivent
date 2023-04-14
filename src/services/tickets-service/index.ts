import { error } from 'console';
import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTicketsType();
}

async function getUserTickets(id: number): Promise<Ticket> {
  const ticket = await ticketsRepository.getUserTickets(id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function postTicket(ticketTypeId: number, id: number) {
  const newTicket = await ticketsRepository.postTicket(ticketTypeId, id);
  //const newTicket:Ticket = await ticketsRepository.getTicketById(newTicketId)

  return newTicket;
}

const ticketsService = {
  getAllTickets,
  getUserTickets,
  postTicket,
};

export default ticketsService;
