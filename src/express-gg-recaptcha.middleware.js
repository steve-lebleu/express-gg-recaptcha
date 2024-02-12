const axios = require('axios');

/**
 * Generates a middleware action for Google re-captcha
 * @param {string} application Application name
 */
exports.verifyRecaptchaV3 = (logger) => async (req, res, next) => {
  try {
    logger.silly('Retrieving gg_recaptcha_secret/gg_recaptcha_score for token verification...');
    const [secret, score, url] = [process.env.GG_RECAPTCHA_SECRET, process.env.GG_RECAPTCHA_SCORE, process.env.GG_RECAPTCHA_URL]

    logger.silly('Calling google recaptcha API...');
    const response = await axios.default.post(`${url}?secret=${secret}&response=${req.body.token}`);

    if (response.status !== 200 || (response.data && !response.data.success)) {
      logger.error('Re-captcha verification call failed');
      return next({ status: 401, statusCode: 401, message: 'Re-captcha verification call failed' });
    }

    if (response.status === 200 && response.data.success && (parseFloat(response.data.score) < parseFloat(score))) {
      logger.error(`Re-captcha verification failed: ${response.data?.action} - score ${response.data?.score} (${score} required)`);
      return next({ status: 401, statusCode: 401, message: 'Re-captcha verification call failed' });
    }

    logger.debug(`Re-captcha verification succesful: ${response.data?.action} - score ${response.data?.score} (${score.value} required)`);
    
    delete req.body.token; // Request is ok, remove token to clean payload for next steps

    next();
  } catch (e) {
    next(e);
  }
};
