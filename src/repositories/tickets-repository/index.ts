import { TicketType, Ticket } from '@prisma/client';
import { prisma } from '@/config';
//import {  } from '@/protocols';

async function getAllTickets() {
  const ticket: TicketType[] = await prisma.ticketType.findMany();
  return ticket;
}

async function getUserTickets(id: number) {
  const ticket: Ticket = await prisma.ticket.findUnique({
    where: { id },
  });

  return ticket;
}

const ticketsRepository = {
  getAllTickets,
  getUserTickets,
};

export default ticketsRepository;
