import { Enrollment, Payment } from '@prisma/client';
import { notFoundError, unauthorizedError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPaymentInfo(userId: number, ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment: Enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (ticket.enrollmentId !== enrollment.id) throw unauthorizedError();

  const payment: Payment = await paymentRepository.getPayment(ticketId);

  return payment;
}

export default {
  getPaymentInfo,
};
