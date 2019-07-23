/**
 * verify user input
 * verify loginToken
 * insert into database
 */
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
      // var colors = ['#ff0000', '#00ff00', '#0000ff'];
      req.body.project.forEach(project => {
        // var random_color = colors[Math.floor(Math.random() * colors.length)];
        data.push({
          name: project.name,
          color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
          createdBy: req.userId
        });
      });
      debug(data)
      models.HomeProj.bulkCreate(data, {
        // field: ['name', 'color', 'createdBy'],
        // updateOnDuplicate: ['name'],
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
              // system: error
            }
          })
        })
    }
  } catch (error) {
    next(error);
  } finally {
    debug('done')
    // res.end()
  }
  debug('-----------------> end project POST')

});
module.exports = router
