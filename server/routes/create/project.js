const express = require('express');
const router = express.Router();
const models = require('../../models');
const Debug = require('debug')
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  name: Joi.string().required(),
  color: Joi.string().required(),
});
router.post('/', async (req, res, next) => {
  const debug = new Debug('-----------------> begin project POST')
  debug(req.headers)
  try {
    var count = Object.keys(req.body.project).length;
    debug(count)
    if (count > 0) {
      var data = [];
      req.body.project.forEach(project => {
        data.push({
          name: project.name,
          color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
          createdBy: req.userId
        });
      });
      debug(data)
      models.HomeProj.bulkCreate(data, {
        updateOnDuplicate: true,
        individualHooks: true,
      }).then((response) => { // Notice: There are no arguments here, as of right now you'll have to...
        if (count == response.length) {
          res.status(200).json({
            message: 'successfully upload',
            project: response
          })
        } else {
          res.status(400).json({
            message: 'Error: mismatch bulk'
          })
        }
      })
        .catch((error) => {
          res.status(401).json({
            message: {
              message: 'data may duplicate',
            }
          })
        })
    }
  } catch (error) {
    next(error);
  } finally {
    debug('done')
  }
  debug('-----------------> end project POST')
});
module.exports = router
