import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getAllHotels() {
  const hotels: Hotel[] = await prisma.hotel.findMany();
  return hotels;
}

async function getHotelRooms(hotelId: number) {
  const rooms = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
  });

  return rooms;
}

const hotelsRepository = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsRepository;
