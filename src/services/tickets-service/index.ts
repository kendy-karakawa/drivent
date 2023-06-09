import { Enrollment, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { UserTicket } from '@/protocols';

async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTicketsType();
}

async function getUserTickets(id: number): Promise<UserTicket> {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(id);
  if (!enrollment) throw notFoundError();
  const ticket = await ticketsRepository.getUserTickets(enrollment.id);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function postTicket(ticketTypeId: number, id: number): Promise<UserTicket> {
  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(id);
  if (!enrollment) throw notFoundError();

  const newTicket = await ticketsRepository.postTicket(ticketTypeId, enrollment.id);

  return newTicket;
}

const ticketsService = {
  getAllTickets,
  getUserTickets,
  postTicket,
};

export default ticketsService;
