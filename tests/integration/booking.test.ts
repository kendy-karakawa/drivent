import faker from '@faker-js/faker';
import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketTypeIsRemoteTrue,
  createTicketTypeNotIncludesHotel,
  createTicketTypeWhenIncludesHotel,
  createUser,
  createbooking,
} from '../factories';
import { createHotel, createHotelRoom } from '../factories/hotels.factory';
import { prisma } from '@/config';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when roomId is not present in body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = {};

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when roomId is not a number in body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: 'string' };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('shoul respond with status 403 when user dont have enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: 1 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('shoul respond with status 403 when user dont have ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      const body = { roomId: 1 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('shoul respond with status 403 when tiket type not includes hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeNotIncludesHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 1 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('shoul respond with status 403 when tiket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeIsRemoteTrue();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 1 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('shoul respond with status 403 when ticketStatus is RESERVED', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWhenIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const body = { roomId: 1 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('shoul respond with status 404 when room dont exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWhenIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const body = { roomId: 100 };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('shoul respond with status 403 when room are unavaliable', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWhenIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const booking = await createbooking(user.id, room.id);
      const body = { roomId: room.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 200 and bookingId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWhenIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const body = { roomId: room.id };

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        bookingId: expect.any(Number),
      });
    });
  });
});

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user dont have booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and user booking data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWhenIncludesHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createHotelRoom(hotel.id);
      const booking = await createbooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: expect.any(Object),
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 400 when bookingId is not a number', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: 1 };

      const response = await server.put(`/booking/${'string'}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when roomId is not present in body', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = {};

      const response = await server.put(`/booking/${1}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should respond with status 400 when roomId is not a number', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = { roomId: 'string' };

      const response = await server.put(`/booking/${1}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe('when token, params and body is valid', () => {
      it('should respond with 403 when user dont have booking', async () => {
        const anotherUser = await createUser();
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWhenIncludesHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createHotelRoom(hotel.id);
        const booking = await createbooking(anotherUser.id, room.id);
        const body = { roomId: room.id };

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it('shoul respond with status 404 when room dont exist', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWhenIncludesHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createHotelRoom(hotel.id);
        const booking = await createbooking(user.id, room.id);
        const body = { roomId: 0 };

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('shoul respond with status 403 when room are unavaliable', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWhenIncludesHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createHotelRoom(hotel.id);
        const booking = await createbooking(user.id, room.id);
        const body = { roomId: room.id };

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it('should respond with status 200 and bookingId', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWhenIncludesHotel();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createHotelRoom(hotel.id);
        const booking = await createbooking(user.id, room.id);
        const newRoom = await createHotelRoom(hotel.id);

        const body = { roomId: newRoom.id };

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          bookingId: expect.any(Number),
        });
      });
    });
  });
});
