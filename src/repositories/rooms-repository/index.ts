import { prisma } from '@/config';

async function getRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

const roomsRepository = {
  getRoom,
};

export default roomsRepository;
