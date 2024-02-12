'use strict';

const axios = require('axios')
const supertest = require('supertest');
const express = require('express');
const { GGRecaptchaV3Router } = require('./index');
const { verifyRecaptchaV3 } = require('./gg-recaptcha.middleware');
const { Parameter } = require('./../parameters');
const{ memoryMongo } = require('./../unit-tests');

describe('Re-Captcha API', () => {
  memoryMongo.setupMemoryMongo();
  
  const app = express();
  app.use(express.json());
  app.use('/api', GGRecaptchaV3Router('gerust'));

  const request = supertest(app);

  describe('POST /api/recaptcha/v3/verify', () => {
    let mockParameterFind, mockPromiseAll;
    beforeEach(() => {
      mockParameterFind = jest.spyOn(Parameter, 'findParameter').mockImplementation(async () => {
        return Promise.resolve({ value: 'value' });
      });
      mockPromiseAll = jest.spyOn(Promise, 'all').mockImplementation(async () => {
        return Promise.resolve([ { value: '6LdiHAgcAAAAAOFtPpaMZKaSwDdYTlUtc1gzH-Dn' }, { value: '0.5' } ]);
      });
    });

    afterAll(() => {
      mockPromiseAll.mockRestore();
      mockParameterFind.mockRestore();
    });

    it('should returns with a success property', async () => {
      const response = await request.post('/api/recaptcha/v3/verify').send({ token: 'atoken' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });

    it('should returns false when request to Google API fails', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 400,
          data: {},
        });
      });
      const response = await request.post('/api/recaptcha/v3/verify').send({ token: 'atoken' });

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(false);
      mockAxios.mockRestore();
    });

    it('should returns false when Google say NO', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 200,
          data: {
            success: false,
            score: 0.1,
          },
        });
      });
      const response = await request.post('/api/recaptcha/v3/verify').send({ token: 'atoken' });

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(false);
      mockAxios.mockRestore();
    });

    it('should returns false when Google say YES but the score is KO regarding local configuration', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            score: 0.4,
          },
        });
      });
      const response = await request.post('/api/recaptcha/v3/verify').send({ token: 'atoken' });

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(false);
      mockAxios.mockRestore();
    });

    it('should returns true when Google say YES and the score is OK regarding local configuration', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            score: 0.6,
          },
        });
      });
      const response = await request.post('/api/recaptcha/v3/verify').send({ token: 'atoken' });

      expect(response.status).toBe(200);
      expect(response.body.success).toEqual(true);
      mockAxios.mockRestore();
    });
  });

  describe('Middleware verifyRecaptchaV3', () => {
    let mockParameterFind, mockPromiseAll;
    let middleware = verifyRecaptchaV3('TEST');

    beforeEach(() => {
      mockParameterFind = jest.spyOn(Parameter, 'findParameter').mockImplementation(async () => {
        return Promise.resolve({ value: 'value' });
      });
      mockPromiseAll = jest.spyOn(Promise, 'all').mockImplementation(async () => {
        return Promise.resolve([ { value: '6LdiHAgcAAAAAOFtPpaMZKaSwDdYTlUtc1gzH-Dn' }, { value: '0.5' } ]);
      });
    });

    afterAll(() => {
      mockPromiseAll.mockRestore();
      mockParameterFind.mockRestore();
    });

    it('should next in Unauthorized error when request to Google API fails', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 400,
          data: {},
        });
      });

      const mockNext = jest.fn((error) => {
        expect(error).toBeDefined();
        expect(error.status).toEqual(401);
        expect(error.message).toContain('Re-captcha verification call failed');
      });

      await middleware({ body: { token: 'atoken' } }, {}, mockNext);

      expect(mockNext).toHaveBeenCalled(); 
      mockAxios.mockRestore();
      mockNext.mockRestore();
    });

    it('should next in Unauthorized error when Google say NO', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 200,
          data: {
            success: false,
            score: 0.1,
          },
        });
      });

      const mockNext = jest.fn((error) => {
        expect(error).toBeDefined();
        expect(error.status).toEqual(401);
        expect(error.message).toContain('Re-captcha verification call failed');
      });

      await middleware({ body: { token: 'atoken' } }, {}, mockNext);

      expect(mockNext).toHaveBeenCalled(); 
      mockAxios.mockRestore();
      mockNext.mockRestore();
    });

    it('should next in Unauthorized error when Google say YES but the score is KO regarding local configuration', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            score: 0.4,
          },
        });
      });
      const mockNext = jest.fn((error) => {
        expect(error).toBeDefined();
        expect(error.status).toEqual(401);
        expect(error.message).toContain('Re-captcha verification failed');
      });

      await middleware({ body: { token: 'atoken' } }, {}, mockNext);

      expect(mockNext).toHaveBeenCalled(); 
      mockAxios.mockRestore();
      mockNext.mockRestore();
    });

    it('should next when Google say YES and the score is OK regarding local configuration', async () => {
      const mockAxios = jest.spyOn(axios, 'post').mockImplementation(async (url) => {
        return Promise.resolve({
          status: 200,
          data: {
            success: true,
            score: 0.6,
          },
        });
      });
      const mockNext = jest.fn((error) => {
        expect(error).toBeUndefined();
      });

      await middleware({ body: { token: 'atoken' } }, {}, mockNext);

      expect(mockNext).toHaveBeenCalled(); 
      mockAxios.mockRestore();
      mockNext.mockRestore();
    });
  });
});
