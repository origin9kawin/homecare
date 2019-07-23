/**
 * verify user input
 * return success token
 * exchange token expire within period of time
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const User = require('../../config/user');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const Debug = require('debug');
const sequelize = require('sequelize');

const schema = Joi.object().keys({
  username: Joi.string().trim().min(User.LENGTH_MIN_USER_SIGNUP).max(User.LENGTH_MAX_PWD_SIGNUP).required(),
  password: Joi.string().trim().required(), // TODO
  loginCount: Joi.string().regex(/^[0-9]{0,65535}$/).required(),
  buttonPressedCount: Joi.string().regex(/^[0-9]{0,65535}$/).required(),
});

router.get('/', (req, res) => res.status(403).send('hello world'));
router.post('/', async (req, res, next) => {
  const debug = Debug('!!!-----------> debug begin signin');
  debug(req.body)
  try {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      debug(result.error)
      res.status(400).json({
        status: 400,
        message: {
          message: 'Error: data input invalid, please try again',
          show: 'Invalid / Missing params',
          system: result.error
        }
      });
      return
    }
    const myPlainTextPassword = req.body.password;
    await models.HomeUser.findOne({
      attributes: [
        'id', 'hashPwd',
        [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('userExpiredAt')), 'userExpiredAt']
      ],
      where: {
        username: req.body.username,
        visible: 1
      }
    }).then(async (homeuserResult) => {
      if (!homeuserResult) {
        res.status(404).json({
          status: 404,
          message: {
            message: 'user not found / active yet',
            show: 'Not found, please try again'
          }
        });
        return
      }
      var now = Math.floor(Date.now() / 1000);
      var userExpiredAt = homeuserResult.get().userExpiredAt;
      if (userExpiredAt < now) {
        res.status(401).json({
          status: 401,
          message: {
            message: 'user is expired',
            show: 'Expire, please report'
          }
        });
        return
      }
      const bcryptResut = await bcrypt.compare(myPlainTextPassword, homeuserResult.get().hashPwd);
      debug(bcryptResut);
      if (bcryptResut.error) {
        res.status(500).json({
          status: 500,
          message: 'Error: crypting'
        })
        return
      }
      if (!bcryptResut) {
        res.status(403).json({
          status: 403,
          message: {
            message: 'Error: crypting mismatch',
            show: 'Invalid, please try again.',
            system: bcryptResut
          }
        })
        return
      }
      const jwt = require('jsonwebtoken');
      var signOptions = {};
      const ms = require('ms');
      signOptions.expiresIn = ms(User.EXPIRE_TOKEN_LOGIN) / 1000; // verifyToken expire
      const userId = homeuserResult.get().id;
      const jwtResult = jwt.sign({ id: userId, }, User.SECRETKEY, signOptions);
      debug(jwtResult);
      if (jwtResult.error) {
        res.status(500).json({
          status: 500,
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
              status: 200,
              message: {
                message: 'successfully login',
                show: 'Login success'
              },
              userId: userId,
              // random token with expiration
              accessToken: jwtResult
            })
          } else {
            res.status(500).json({
              status: 500,
              message: {
                message: 'update failed',
              }
            });
          }
        })
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: {
        message: 'there is something wrong',
      }
    });
  } finally {
    debug('done trying')
  }
  debug('!!!-----------> debug end signin');

});
module.exports = router