/**
 *  Property of Origin
 */

require('dotenv').config({ path: __dirname + '/.env' })
const express = require('express');
const jwt = require('jsonwebtoken');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uploadConfig = require('./config/upload');
const User = require('./config/user');
const winston = require('winston');
const { errors } = require('celebrate');
const logger = require('./routes/middlewares/logger');

const { PORT, NODE_ENV } = process.env;

const app = express();
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.disable('x-powered-by');
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadConfig.UPLOAD_LOCATION));
app.use('/api/create/hmcaseImage', loginValidation, require('./routes/create/hmcaseimage.js'));
app.use('/api/create/hmcaseDetail', loginValidation, require('./routes/create/hmcasedetail.js'));
app.use('/api/create/hmcase', loginValidation, require('./routes/create/hmcase.js'));
app.use('/api/create/project', loginValidation, require('./routes/create/project.js'));
app.use('/api/create/reason', loginValidation, require('./routes/create/reason.js'));
app.use('/api/create/status', loginValidation, require('./routes/create/status.js'));
app.use('/api/create/maincat', loginValidation, require('./routes/create/maincat.js'));
app.use('/api/create/subcat', loginValidation, require('./routes/create/subcat.js'));
app.use('/api/signup', require('./routes/sign/signup'));
app.use('/api/signin', require('./routes/sign/signin'));
app.use('/api/signout', require('./routes/sign/signout'));

app.use(errors());
app.use(logger);

function loginValidation(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, User.SECRETKEY, (error, authData) => {
      if (error) {
        // console.log(error)
        console.log('403 from valid function');
        res.status(403).json({
          status: 403,
          message: {
            system: error.name,
            message: "invalid token"
          },
          system: error
        });
      } else {
        req.userId = authData.id;
        // setTimeout(() => next(), 2000);
        next();
      }
    })
  } else {
    console.log('require Bearer authorization header');
    res.status(403).json({
      status: 403,
      message: {
        message: "require an authorization header",
      }
    });
  }
}

if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    winston.info(`Server listening on http://localhost:${PORT}`);
  });
}
