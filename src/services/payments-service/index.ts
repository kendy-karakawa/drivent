import { Enrollment, Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { CardData } from '@/protocols';

async function getPaymentInfo(userId: number, ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  const payment: Payment = await paymentRepository.getPayment(ticketId);

  return payment;
}

async function postPayment(userId: number, ticketId: number, cardData: CardData): Promise<Payment> {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  const data: Omit<Payment, 'id'> = {
    ticketId,
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: cardData.number.toString().substring(11),
  };

  const payment: Payment = await paymentRepository.postPayment(data);
  await ticketsRepository.updateTicket(ticketId);

  return payment;
}

export default {
  getPaymentInfo,
  postPayment,
};
