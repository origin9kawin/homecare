const express = require('express');
const router = express.Router();
const models = require('../../models');
const User = require('../../config/user');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const isEmpty = require('lodash.isempty');
const Joi = require('@hapi/joi');
const Debug = require('debug');
const schema = Joi.object().keys({
  username: Joi.string().trim().min(User.LENGTH_MIN_USER_SIGNUP).max(User.LENGTH_MAX_PWD_SIGNUP).required(),
  password: Joi.string().trim().required(), // TODO
  email: Joi.string().email({ minDomainSegments: 2 }),
  firstname: Joi.string().required(),
  expire: Joi.string().regex(/^[smhdy0-9]{2,30}$/)
});
router.get('/', (req, res) => res.status(403).send('hello world'));
router.post('/', async (req, res, next) => {
  const debug = Debug('!!!-----------> debug begin signup');
  try {
    debug(req.body);
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      res.status(400).json({
        message: 'Error: data input invalid, please try again',
        system: result.error
      });
      return
    }
    const saltRounds = 10;
    const myPlainTextPassword = req.body.password;
    const bcryptResult = await bcrypt.hash(myPlainTextPassword, saltRounds);
    if (bcryptResult.error) {
      res.status(500).json({ message: 'Error: encrypting' });
      return
    }
    debug(bcryptResult);
    var signOptions = {};
    var expireEmpty = isEmpty(req.body.expire);
    var data = {};
    if (!expireEmpty) {
      const ms = require('ms');
      const seconds = ms(req.body.expire) / 1000
      signOptions.expiresIn = ms(User.EXPIRE_TOKEN_LOGIN) / 1000; // verifyToken expire
      data.userExpiredAt = userExpiredAt(seconds);
    }
    const jwtResult = jwt.sign({ id: uuidv4() }, User.SECRETKEY, signOptions)
    debug(jwtResult);
    if (jwtResult.error) {
      res.status(500).json({ message: 'Error: tokening' });
      return
    }
    data.username = req.body.username;
    data.email = req.body.email;
    data.firstname = req.body.firstname;
    data.hashPwd = bcryptResult;
    data.verifyToken = jwtResult;
    data.visible = User.USER_DEFAULT_VISIBLE;
    debug(data.visible);
    const Sequelize = require('sequelize');
    await models.HomeUser
      .findOrCreate({
        attributes: [
          'id', 'username', 'email',
        ],
        where: {
          [Sequelize.Op.or]: [
            { username: data.username },
            { email: data.email },
          ]
        },
        defaults: data,
      })
      .spread((homeuserResult, created) => {
        if (!created) {
          res.status(400).json({
            message: 'data input may exist'
          });
        } else {
          res.status(201).json({
            message: {
              message: 'successfully created',
              show: 'verification email has been sent'
            },
            username: homeuserResult.get().username,
            email: homeuserResult.get().email,
          });
        }
      })
  } catch (error) {
    next(error);
  } finally {
    debug('done trying')
  }
  debug('!!!-----------> debug end signup');
});
function userExpiredAt(seconds) {
  var now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  var feature = new Date(now);
  return feature;
}
module.exports = router;
