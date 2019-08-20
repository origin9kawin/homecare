const express = require('express');
const router = express.Router();
const models = require('../../models');
const Debug = require('debug')
router.post('/', async (req, res, next) => {
  const debug = new Debug('------------> debin')
  try {
    var count = Object.keys(req.body.status).length;
    debug(count)
    if (count > 0) {
      var data = [];
      req.body.status.forEach(status => {
        data.push({
          name: status.name,
          color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
          createdBy: req.userId
        });
      });
      models.HomeStatus.bulkCreate(data, {
        updateOnDuplicate: true,
        individualHooks: true,
      }).then((response) => { // Notice: There are no arguments here, as of right now you'll have to...
        if (req.body.status.length == response.length) {
          res.status(200).json({
            message: 'successfully upload',
            status: response
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
  debug('---------------------> end')
});
module.exports = router
