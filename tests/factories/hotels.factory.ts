import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.lastName(),
      image: faker.image.dataUri(),
    },
  });
}

export async function createHotelRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.firstName(),
      capacity: 1,
      hotelId: hotelId,
    },
  });
}
