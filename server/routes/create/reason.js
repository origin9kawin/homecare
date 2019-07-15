/**
 * verify user input
 * verify loginToken
 * insert into database
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
router.post('/', async (req, res, next) => {
  try {
    if (req.body.reason.length > 1) {
      var data = [];
      req.body.reason.forEach(reason => {
        data.push({
          name: reason.name,
          color: reason.color,
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
          res.status(401).end()
        })
    }
  } catch (error) {
    next(error);
  } finally {
    console.log('done')
    // res.end()
  }

});

module.exports = router
