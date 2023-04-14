import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function getPayment(ticketId: number): Promise<Payment> {
  const payment: Payment = await prisma.payment.findFirst({
    where: { ticketId },
  });

  return payment;
}

const paymentRepository = {
  getPayment,
};

export default paymentRepository;
