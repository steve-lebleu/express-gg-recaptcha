'use strict';

process.env.GG_RECAPTCHA_URL    = 'https://www.google.com/recaptcha/api/siteverify';
process.env.GG_RECAPTCHA_SCORE  = 0.7;
process.env.GG_RECAPTCHA_SECRET = 'gg-amazing-secret';

const axios = require('axios')

const { verifyRecaptchaV3 } = require('./express-gg-recaptcha.middleware');


describe('Re-Captcha API', () => {
  const logger = {
    silly: (message) => { console.log(message); },
    error: (message) => { console.log(message); },
    debug: (message) => { console.log(message); }
  };

  describe('Middleware verifyRecaptchaV3', () => {
    let middleware = verifyRecaptchaV3(logger);

    beforeEach(() => {});
    afterAll(() => {});

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

    it('should next in unauthorized error when Google say YES but the score is KO regarding local configuration', async () => {
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
        expect(error.message).toContain('Re-captcha verification call failed');
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
            score: 0.7,
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
