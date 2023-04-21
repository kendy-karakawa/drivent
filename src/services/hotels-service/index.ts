import hotelsRepository from '@/repositories/hotels-repository';

async function getAllHotels() {
  const hotels = await hotelsRepository.getAllHotels();

  return hotels;
}

async function getHotelRooms(hotelId: number) {
  const rooms = await hotelsRepository.getHotelRooms(hotelId);
  return rooms;
}

const hotelsService = {
  getAllHotels,
  getHotelRooms,
};

export default hotelsService;
