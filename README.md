# Google ReCaptcha V3 for Express.js

## Prerequisites

- Project should be created in https://www.google.com/recaptcha/admin/.
- Domain name of the consummer application must be whitelisted in https://www.google.com/recaptcha/admin/. 
- Front-end client must integrate Google recaptcha srcripts in order to call your backend, who's call the Google API and pass the response
- An environment variable named *GG_RECAPTCHA_URL*, which has as value the url to attack to verify the token.
- An environment variable name *GG_RECAPTCHA_SCORE*, which has as value the minimal score required to succeed (between 0 and 1).
- An environment secret named *GG_RECAPTCHA_SECRET*, which has as value the Google recaptcha secret associated to the site key.
  
## How to ?

### Middleware way

Useful if you want the all in one solution and just allow or not an action

#### 1. Import re-captcha middleware

```javascript
import { verifyRecaptchaV3 } from 'express-gg-recaptcha/gg-recaptcha.middleware';
```

#### 2. Plug re-captcha middleware on the route which should be protected

```javascript
app.use('/api', verifyRecaptchaV3('YOUR_APP_NAME'));
```

The middleware returns a 401 Unauthorized error if the verification fails.

## Tests

## Licence

## Contact

steve.lebleu@