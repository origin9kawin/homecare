/**
 * verify user input
 * return success token
 * exchange token expire within period of time
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const Auth = require('../../config/authentication');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  // password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  password: Joi.string().trim()
});
router.post('/', async (req, res, next) => {
  console.log(req.body.session);
  try {
    const result = Joi.validate(req.body.session, schema);
    if (result.error) {
      res.status(400).json({ message: 'Error: data input invalid, please try again' });
      return
    }
    const myPlainTextPassword = req.body.session.password;
    const sequelize = require('sequelize');
    await models.HomeUser.findOne({
      attributes: [
        'id', 'hashPwd',
        [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('userExpiredAt')), 'userExpiredAt']
      ],
      where: {
        username: req.body.session.username,
        visible: 1
      }
    }).then(async (homeuserResult) => {
      if (!homeuserResult) {
        res.status(403).json({
          message: 'user not found / active yet'
        });
        return
      }
      var now = Math.floor(Date.now() / 1000);
      var userExpiredAt = homeuserResult.get().userExpiredAt;
      if (userExpiredAt < now) {
        res.status(403).json({
          message: 'user is expired'
        });
        return
      }
      const bcryptResut = await bcrypt.compare(myPlainTextPassword, homeuserResult.get().hashPwd);
      console.log(bcryptResut);
      if (bcryptResut.error) {
        res.status(400).json({
          message: 'Error: crypting'
        })
        return
      }
      if (!bcryptResut) {
        res.status(400).json({
          message: 'Error: crypting mismatch'
        })
        return
      }
      const jwt = require('jsonwebtoken');
      var signOptions = {};
      const ms = require('ms');
      signOptions.expiresIn = ms(Auth.loginTokenExpire) / 1000; // verifyToken expire
      const userId = homeuserResult.get().id;
      const jwtResult = jwt.sign({ id: userId, }, Auth.secretKey, signOptions);
      console.log(jwtResult);
      if (jwtResult.error) {
        res.status(400).json({
          message: 'Error: tokening'
        })
        return
      }
      // update loginToken
      await models.HomeUser.update({
        loginToken: jwtResult
      }, {
          where: {
            id: userId
          }
        })
        .then(homeuserResult => {
          if (homeuserResult) {
            res.status(200).json({
              message: 'successfully login',
              userId: userId,
              // random token with expiration
              accessToken: jwtResult
            })
          } else {
            res.status(403).json({
              message: 'update failed'
            });
          }
        })
    })
  } catch (error) {
    next(error);
  } finally {
    console.log('done')
    res.end();
  }
});
module.exports = router