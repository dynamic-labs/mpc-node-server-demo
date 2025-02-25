import { faker } from '@faker-js/faker';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import request from 'supertest';
import { evervaultDecrypt } from '../../services/evervault';
import { verifyJWT } from '../../services/jwt';
import { registerOperationHandlers } from './registerOperationHandlers';

jest.mock('../../services/jwt');
jest.mock('../../services/evervault');
jest.mock('express-openapi-validator', () => ({
  middleware: () => (_req: Request, _res: Response, next: NextFunction) =>
    next(),
}));

describe('registerOperationHandlers', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    registerOperationHandlers(app);
  });

  describe('JWT Verification', () => {
    const validEac = {
      environmentId: 'env_123',
      userId: 'user_123',
    };

    const validJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;

    beforeEach(() => {
      (verifyJWT as jest.Mock).mockResolvedValue({ isVerified: true });
      (evervaultDecrypt as jest.Mock).mockImplementation((_eac: string) => {
        return JSON.stringify(validEac);
      });
    });

    it('should allow requests with valid JWT and EAC', async () => {
      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .set('Authorization', `Bearer ${validJwt}`)
        .send({
          serverEacs: [JSON.stringify(validEac)],
        });

      expect(response.status).not.toBe(403);
      expect(verifyJWT).toHaveBeenCalledWith({
        environmentId: validEac.environmentId,
        dynamicUserId: validEac.userId,
        rawJwt: validJwt,
      });
    });

    it('should reject requests without EAC', async () => {
      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          jwt: validJwt,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error_code: 'missing_eac',
        error_message: 'At least one EAC is required for this operation',
      });
    });

    it.skip('should reject requests with invalid JWT', async () => {
      (verifyJWT as jest.Mock).mockResolvedValue({ isVerified: false });

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          jwt: 'invalid.jwt',
          serverEacs: [JSON.stringify(validEac)],
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        error_code: 'jwt_invalid',
        error_message: 'The JWT could not be verified',
      });
    });

    it.skip('should reject requests with JWT verification errors', async () => {
      (verifyJWT as jest.Mock).mockRejectedValue({
        isVerified: false,
        verifiedPayload: undefined,
      });

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          jwt: validJwt,
          serverEacs: [JSON.stringify(validEac)],
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        error_code: 'jwt_verification_failed',
        error_message: 'JWT verification failed',
      });
    });

    it('should reject requests with EAC missing environmentId', async () => {
      const invalidEac = {
        userId: 'user_123', // missing environmentId
      };
      (evervaultDecrypt as jest.Mock).mockImplementation((_eac: string) => {
        return JSON.stringify(invalidEac);
      });
      const validJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          jwt: validJwt,
          serverEacs: [invalidEac],
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error_code: 'invalid_eac',
        error_message: 'First EAC must contain environmentId and userId',
      });
      expect(verifyJWT).not.toHaveBeenCalled();
    });

    it('should reject requests with EAC missing userId', async () => {
      const invalidEac = {
        environmentId: 'env_123', // missing userId
      };
      (evervaultDecrypt as jest.Mock).mockImplementation((_eac: string) => {
        return JSON.stringify(invalidEac);
      });
      const validJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          jwt: validJwt,
          serverEacs: [invalidEac],
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error_code: 'invalid_eac',
        error_message: 'First EAC must contain environmentId and userId',
      });
      expect(verifyJWT).not.toHaveBeenCalled();
    });

    it('should reject requests with empty EAC object', async () => {
      const invalidEac = {}; // empty EAC
      (evervaultDecrypt as jest.Mock).mockImplementation((_eac: string) => {
        return JSON.stringify(invalidEac);
      });
      const validJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          jwt: validJwt,
          serverEacs: [invalidEac],
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error_code: 'invalid_eac',
        error_message: 'First EAC must contain environmentId and userId',
      });
      expect(verifyJWT).not.toHaveBeenCalled();
    });
  });

  describe('EAC Processing', () => {
    const mockEacData = {
      environmentId: 'env_123',
      userId: 'user_123',
      serverKeygenInitResult: { key: 'test-result' },
    };

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      (verifyJWT as jest.Mock).mockResolvedValue({ isVerified: true });
      (evervaultDecrypt as jest.Mock).mockImplementation((_eac: string) => {
        return JSON.stringify(mockEacData);
      });
    });

    afterEach(() => {
      process.env.NODE_ENV = 'test';
    });

    it('should process serverEacs in development environment', async () => {
      const serverEacs = ['encrypted_eac_1', 'encrypted_eac_2'];
      const validJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          serverEacs,
          jwt: validJwt,
        });

      expect(evervaultDecrypt).toHaveBeenCalledTimes(2);
      expect(evervaultDecrypt).toHaveBeenCalledWith('encrypted_eac_1');
      expect(evervaultDecrypt).toHaveBeenCalledWith('encrypted_eac_2');
      expect(response.status).not.toBe(400);

      // Verify the processed EACs in the request body
      expect(response.body.serverEacs).toBeUndefined(); // Since our mock OpenAPI validator doesn't modify the response
    });

    it('should process multiple types of EACs', async () => {
      const eacs = ['encrypted_eac_1'];
      const validJwt = `${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}.${faker.string.alphanumeric(32)}`;

      const response = await request(app)
        .post('/api/v1/actions/CreateRoom')
        .send({
          serverEacs: eacs,
          newServerEacs: eacs,
          existingServerEacs: eacs,
          jwt: validJwt,
        });

      expect(evervaultDecrypt).toHaveBeenCalledTimes(3);
      expect(response.status).not.toBe(400);
    });
  });

  describe('Protected Routes', () => {
    it('should not apply JWT verification to non-protected routes', async () => {
      const response = await request(app)
        .post('/api/v1/some-other-route')
        .send({});

      expect(verifyJWT).not.toHaveBeenCalled();
      expect(response.status).not.toBe(403);
    });
  });
});
