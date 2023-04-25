import { ApplicationError } from '@/protocols';

export function unavailableRoomError(): ApplicationError {
  return {
    name: 'unavailableRoomError',
    message: 'Unavailable Room',
  };
}
