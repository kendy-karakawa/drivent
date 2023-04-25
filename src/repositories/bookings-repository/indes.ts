import { prisma } from '@/config';

async function postBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function getBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    include: {
      Room: true,
    },
  });
}

async function countRoomsBooked(roomId: number) {
  return prisma.booking.count({
    where: {
      roomId: roomId,
    },
  });
}

const bookingsRepository = {
  postBooking,
  getBooking,
  countRoomsBooked,
};

export default bookingsRepository;