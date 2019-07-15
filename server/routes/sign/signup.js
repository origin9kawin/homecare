/**
 * valid user input
 * generate verify token with expire in hrs
 * check to see if they is exist in database
 * return success and error in json*
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const Auth = require('../../config/authentication');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const isEmpty = require('lodash.isempty');
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  email: Joi.string().required(),
  firstname: Joi.string().required(),
  expire: Joi.string().regex(/^[smhdy0-9]{2,30}$/)
});
router.post('/', async (req, res, next) => {
  try {
    console.log(req);
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      res.status(400).json({ message: 'Error: data input invalid, please try again' });
      return
    }
    const saltRounds = 10;
    const myPlainTextPassword = req.body.password;
    const bcryptResult = await bcrypt.hash(myPlainTextPassword, saltRounds);
    if (bcryptResult.error) {
      res.status(400).json({ message: 'Error: encrypting' });
      return
    }
    console.log(bcryptResult);
    var signOptions = {};
    var expireEmpty = isEmpty(req.body.expire);
    var data = {};
    if (!expireEmpty) {
      const ms = require('ms');
      const seconds = ms(req.body.expire) / 1000
      signOptions.expiresIn = ms(Auth.verifyTokenExpire) / 1000; // verifyToken expire
      data.userExpiredAt = userExpiredAt(seconds);
    }
    const jwtResult = jwt.sign({ id: uuidv4() }, Auth.secretKey, signOptions)
    console.log(jwtResult);
    if (jwtResult.error) {
      res.status(400).json({ message: 'Error: tokening' });
      return
    }
    // data.id = uuid;
    data.username = req.body.username;
    data.email = req.body.email;
    data.firstname = req.body.firstname;
    data.hashPwd = bcryptResult;
    data.verifyToken = jwtResult;
    data.visible = 1;
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
        defaults: data
      })
      .spread((homeuserResult, created) => {
        if (!created) {
          res.status(400).json({
            message: 'data input may exist'
          });
        } else {
          res.status(200).json({
            message: 'successfully created',
            username: homeuserResult.get().username,
            email: homeuserResult.get().email,
          });
        }
      })
  } catch (error) {
    next(error);
  } finally {
    console.log('done')
    res.end();
  }
});
function userExpiredAt(seconds) {
  var now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  var feature = new Date(now);
  return feature;
}
module.exports = router;
