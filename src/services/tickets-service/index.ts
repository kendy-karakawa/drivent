import { TicketType } from '@/protocols';
import ticketsRepository from '@/repositories/tickets-repository';

async function getAllTickets(): Promise<TicketType[]> {
  return await ticketsRepository.getAllTickets();
}

const ticketsService = {
  getAllTickets,
};

export default ticketsService;
