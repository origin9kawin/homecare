/**
 *  Property 's Origin
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uploadConfig = require('./config/upload');
const Auth = require('./config/authentication');
const app = express();
app.use(morgan('dev'));
// app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads', express.static(uploadConfig.location));
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

function loginValidation(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, Auth.secretKey, (error, authData) => {
      if (error) {
        console.log('403 from valid function');
        res.sendStatus(403);
      } else {
        req.userId = authData.id;
        next();
      }
    })
  } else {
    console.log('require Bearer authorization header');
    res.sendStatus(403);
  }
}
app.listen(5000, () => console.log('Server started: 5000'));
