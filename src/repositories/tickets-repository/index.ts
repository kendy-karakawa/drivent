import { prisma } from '@/config';
import { TicketType } from '@/protocols';

async function getAllTickets() {
  const ticket: TicketType[] = await prisma.ticketType.findMany();
  return ticket;
}

const ticketsRepository = {
  getAllTickets,
};

export default ticketsRepository;
