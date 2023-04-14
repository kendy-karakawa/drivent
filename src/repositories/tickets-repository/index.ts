import { TicketType, Ticket, Enrollment } from '@prisma/client';
import { prisma } from '@/config';
import { UserTicket } from '@/protocols';
//import {  } from '@/protocols';

async function getAllTicketsType(): Promise<TicketType[]> {
  const ticket: TicketType[] = await prisma.ticketType.findMany();
  return ticket;
}

async function getUserTickets(enrollmentId: number): Promise<UserTicket> {
  const ticket = await prisma.ticket.findFirst({
    where: { enrollmentId },
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

async function getTicketById(id: number): Promise<UserTicket> {
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

async function postTicket(ticketTypeId: number, enrollmentId: number): Promise<UserTicket> {
  const newTicket = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId,
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
