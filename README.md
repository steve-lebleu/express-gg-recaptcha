![Github action workflow status](https://github.com/steve-lebleu/express-gg-recaptcha/actions/workflows/build.yml/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/steve-lebleu/express-gg-recaptcha/badge.svg?branch=master)](https://coveralls.io/github/steve-lebleu/express-gg-recaptcha?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/steve-lebleu/express-gg-recaptcha/badge)](https://www.codefactor.io/repository/github/steve-lebleu/express-gg-recaptcha)
![GitHub Release](https://img.shields.io/github/v/release/steve-lebleu/express-gg-recaptcha?logo=Github)
![Known Vulnerabilities](https://snyk.io/test/github/steve-lebleu/express-gg-recaptcha/badge.svg)
![GitHub License](https://img.shields.io/github/license/steve-lebleu/express-gg-recaptcha?color=%230A7BBC)

# Google ReCaptcha V3 for Express.js

Endpoint protection using express validation midlleware.

![Middleware illustration](https://cdn.konfer.be/images/packages/express-gg-recaptcha-middleware.png)

## Prerequisites

- Project should be created in https://www.google.com/recaptcha/admin/.
- Domain name of the consummer application must be whitelisted in https://www.google.com/recaptcha/admin/. 
- Front-end client must integrate Google recaptcha srcripts in order to call your backend, who's call the Google API.
- An environment variable named *GG_RECAPTCHA_URL*, which has as value the url to attack to verify the token.
- An environment variable name *GG_RECAPTCHA_SCORE*, which has as value the minimal score required to succeed (between 0 and 1).
- An environment secret named *GG_RECAPTCHA_SECRET*, which has as value the Google recaptcha secret associated to the site key.
  
## How to ?

#### 1. Import re-captcha middleware

```javascript
const { verifyRecaptchaV3 } = require('express-gg-recaptcha/gg-recaptcha.middleware');
```

#### 2. Plug re-captcha middleware on the route which should be protected

```javascript
app.use('/api', verifyRecaptchaV3(logger), controllerAction);
```

The function take one optional parameter - the local logger, and returns the middleware. This one returns a 401 if the verification fails, and next to your endpoint if the check is OK.

## Tests

```javascript
$ npm run test
```

## Contact

ping@steve.lebleu.dev