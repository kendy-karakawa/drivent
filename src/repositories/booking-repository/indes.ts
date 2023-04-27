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

async function updateBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    },
  });
}

const bookingsRepository = {
  postBooking,
  getBooking,
  countRoomsBooked,
  updateBooking,
};

export default bookingsRepository;
