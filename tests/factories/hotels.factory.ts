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
  return prisma.room.createMany({
    data: [
      {
        name: 'Room 01',
        capacity: 4,
        hotelId: hotelId,
      },
      {
        name: 'Room 02',
        capacity: 4,
        hotelId: hotelId,
      },
      {
        name: 'Room 03',
        capacity: 4,
        hotelId: hotelId,
      },
    ],
  });
}
