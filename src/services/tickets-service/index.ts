import { error } from 'console';
import { Address, Enrollment, Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTicketsType();
}

async function getUserTickets(id: number): Promise<Ticket> {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(id);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getUserTickets(enrollment.id);
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
