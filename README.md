![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/express-gg-recaptcha?logo=Github)
![Github action workflow status](https://github.com/steve-lebleu/express-gg-recaptcha/actions/workflows/build.yml/badge.svg?branch=main)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/express-gg-recaptcha/badge.svg?branch=main)](https://coveralls.io/github/steve-lebleu/express-gg-recaptcha?branch=main)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/express-gg-recaptcha/badge?s=315e10425bc4c886cbc067d1ff2faa767e0cd04d)](https://www.codefactor.io/repository/github/steve-lebleu/express-gg-recaptcha)
![GitHub License](https://img.shields.io/github/license/steve-lebleu/express-gg-recaptcha)

# Google ReCaptcha V3 middleware for Express.js

Endpoint protection using express validation midlleware.

![Middleware illustration](https://cdn.konfer.be/images/packages/express-gg-recaptcha-middleware.png)

## Prerequisites

- A project in https://www.google.com/recaptcha/admin/.
- A domain name whitelisted in this project. 
- A Google recaptcha front-end integration in order to call your backend, who's call the Google API.
- A Google recaptcha secret associated to the site key.

:link: [Google official documentation](https://developers.google.com/recaptcha/docs/verify)

## How to ?

#### 1. Import re-captcha middleware

```javascript
const { verifyGGRecaptchaV3 } = require('express-gg-recaptcha/gg-recaptcha.middleware');
```

#### 2. Plug re-captcha middleware generator on the endpoint to protect

```javascript
app.use('/api', verifyGGRecaptchaV3(secret, score, logger), controllerAction);
```

The function takes one required and two optional parameters:

- secret - Google recaptcha secret - Required
- score - Minimal score to consider token as valid, between 0 and 1 - Optional - Default: 0.7
- logger - A local logger who's can be useful to debug - Optional - Default process.stdout

The middleware expects next the token to verify, plugged on **req.body.token**.

#### 3. Behaviors

The middleware throws an error when:
  - secret is not provided or with an invalid format
  - score is provided explicitely but invalid

The middleware call next:
- with a 401 if the token verification fails
- with the catched Error instance if an unexpected error occurs
- with nothing in case of success

In case of success, the token is removed from the req.body object before to call next.

## Tests

```javascript
$ npm run test
```

## License

[MIT](LICENCE)

## Contact

ping@steve.lebleu.dev