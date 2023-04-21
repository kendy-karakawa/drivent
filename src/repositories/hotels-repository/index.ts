import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getAllHotels() {
  const hotels: Hotel[] = await prisma.hotel.findMany();
  return hotels;
}

async function getHotelById(hotelId: number) {
  const hotels: Hotel = await prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
  });
  return hotels;
}

async function getHotelRooms(hotelId: number) {
  const hotelRooms = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });

  return hotelRooms;
}

const hotelsRepository = {
  getAllHotels,
  getHotelById,
  getHotelRooms,
};

export default hotelsRepository;
