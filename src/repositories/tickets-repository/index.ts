import { TicketType, Ticket, Enrollment } from '@prisma/client';
import { prisma } from '@/config';
//import {  } from '@/protocols';

async function getAllTicketsType() {
  const ticket: TicketType[] = await prisma.ticketType.findMany();
  return ticket;
}

async function getUserTickets(userId: number) {
  const ticket: Ticket = await prisma.ticket.findFirst({
    where: { enrollmentId: { equals: userId } },
  });

  return ticket;
}

async function getTicketById(id: number) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return ticket;
}

async function postTicket(ticketTypeId: number, userId: number) {
  const newTicket = await prisma.ticket.create({
    data: {
      TicketType: { connect: { id: ticketTypeId } },
      Enrollment: { connect: { userId: userId } },
      status: 'RESERVED',
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newTicket;
}

const ticketsRepository = {
  getAllTicketsType,
  getTicketById,
  getUserTickets,
  postTicket,
};

export default ticketsRepository;
