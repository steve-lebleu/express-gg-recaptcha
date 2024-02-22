![Github action workflow status](https://github.com/steve-lebleu/express-gg-recaptcha/actions/workflows/build.yml/badge.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/express-gg-recaptcha/badge.svg?branch=main)](https://coveralls.io/github/steve-lebleu/express-gg-recaptcha?branch=main)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/express-gg-recaptcha/badge?s=315e10425bc4c886cbc067d1ff2faa767e0cd04d)](https://www.codefactor.io/repository/github/steve-lebleu/express-gg-recaptcha)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/express-gg-recaptcha?logo=Github)
![GitHub License](https://img.shields.io/github/license/steve-lebleu/express-gg-recaptcha)

# Google ReCaptcha V3 for Express.js

Endpoint protection using express validation midlleware.

:link: [Official documentation](https://developers.google.com/recaptcha/docs/verify)

![Middleware illustration](https://cdn.konfer.be/images/packages/express-gg-recaptcha-middleware.png)

## Prerequisites

- A project entry in https://www.google.com/recaptcha/admin/.
- A domain name whitelisted in https://www.google.com/recaptcha/admin/. 
- A Google recaptcha front-end integration in order to call your backend, who's call the Google API.
- An environment secret *GG_RECAPTCHA_SECRET*: Google recaptcha secret associated to the site key.
- An environment variable *GG_RECAPTCHA_SCORE*: minimal score required to succeed (between 0 and 1).
  
## How to ?

#### 1. Import re-captcha middleware

```javascript
const { verifyRecaptchaV3 } = require('express-gg-recaptcha/gg-recaptcha.middleware');
```

#### 2. Plug re-captcha middleware generator on the endpoint to protect

```javascript
app.use('/api', verifyRecaptchaV3(process.env.GG_RECAPTCHA_SECRET, process.env.GG_RECAPTCHA_SCORE, logger), controllerAction);
```

The function takes one required and two optional parameters:

- Google recaptcha secret - Required
- Minimal score to consider as valid, between 0 and 1 - Optional - Default: 0.7
- A local logger who's can be useful to debug - Optional - Default on process.stdout
 
Practically, it returns next a middleware, so this is how your endpoint looks like after the function is executed:

```javascript
app.use('/api', (req, res, next => { /* Here we do the job */ }), controllerAction);
```

The middleware expects the token to verify plugged on the body of the request - so on req.body.token.

- It returns a 400 if the token is not present or not valid.
- It returns a 401 if the verification fails.
- It next to your endpoint if the check is OK.

## Tests

```javascript
$ npm run test
```

## License

[MIT](LICENCE)

## Contact

ping@steve.lebleu.dev