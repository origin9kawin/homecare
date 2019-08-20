const express = require('express');
const router = express.Router();
const models = require('../../models');
const Joi = require('@hapi/joi');
const Debug = require('debug');
const schema = Joi.object().keys({
  userId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
  loginToken: Joi.string().required()
});
router.get('/', (req, res) => res.status(403).send('hello world'));
router.put('/', async (req, res, next) => {
  const debug = Debug('!!!-----------> debug begin signout');
  debug(req.body)
  try {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      res.status(400).json({ message: 'Error: data input invalid, please try again' });
      return
    }
    await models.HomeUser.findOne({
      attributes: [
        'id',
      ],
      where: {
        id: req.body.userId,
        loginToken: req.body.loginToken
      }
    }).then((userInfo) => {
      if (userInfo) {
        var now = new Date();
        userInfo.update({
          loginToken: null,
          lastLogout: now
        }).then((update) => {
          res.status(201).json({
            status: 201,
            message: {
              message: 'Successfully logout',
            }
          })
        })
      } else {
        debug('not found');
        res.status(401).json({
          status: 401,
          message: {
            message: 'user not found'
          }
        });
      }
    })
  } catch (error) {
    next(error);
  } finally {
    debug('done trying')
  }
  debug('!!!-----------> debug end signout');
})
module.exports = router
