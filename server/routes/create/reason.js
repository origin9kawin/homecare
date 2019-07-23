/**
 * verify user input
 * verify loginToken
 * insert into database
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const Debug = require('debug')

router.post('/', async (req, res, next) => {
  const debug = new Debug('------------> debin')
  try {
    var count = Object.keys(req.body.reason).length;
    debug(count)
    if (count > 0) {
      var data = [];
      req.body.reason.forEach(reason => {
        data.push({
          name: reason.name,
          color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
          createdBy: req.userId
        });
      });
      models.HomeReason.bulkCreate(data, {
        // field: ['name', 'color', 'createdBy'],
        // updateOnDuplicate: ['name'],
        updateOnDuplicate: true,
        individualHooks: true,
      }).then((response) => { // Notice: There are no arguments here, as of right now you'll have to...
        if (req.body.reason.length == response.length) {
          res.status(200).json({
            message: 'successfully upload',
            reason: response
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
  debug('---------------------> end')

});

module.exports = router
