import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: 'Hotel xyz',
      image: faker.image.dataUri(),
    },
  });
}

export async function createHotelRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: 'Room 01',
      capacity: 1,
      hotelId: hotelId,
    },
  });
}
