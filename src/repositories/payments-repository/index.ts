import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function getPayment(ticketId: number): Promise<Payment> {
  const payment: Payment = await prisma.payment.findFirst({
    where: { ticketId },
  });

  return payment;
}

async function postPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) {
  const payment = await prisma.payment.create({
    data,
  });

  return payment;
}

const paymentRepository = {
  getPayment,
  postPayment,
};

export default paymentRepository;
