/**
 * clear loginToken
 * return json navigate user to login view
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  // userId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
  loginToken: Joi.string().trim().required()
  // -/^[a-zA-Z0-9.-_]{165,188}$/
});
router.get('/', async (req, res, next) => {
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
        // id: req.body.userId,
        loginToken: req.body.loginToken
      }
    }).then((userInfo) => {
      if (userInfo) {
        var now = new Date();
        userInfo.update({
          loginToken: null,
          lastLogout: now
        }).then((update) => {
          res.status(200).json({
            message: 'Successfully logout',
          })
        })
      } else {
        console.log('not found');
        res.status(401).json({
          message: 'user not found'
        });
      }
    })
  } catch (error) {
    next(error);
  }
})

module.exports = router
