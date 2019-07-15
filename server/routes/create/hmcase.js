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
    console.log(models.HomeCase)
    if (req.body.cases.length == 1) {
      var cases = req.body.cases[0];
      var data = []
      data.push({
        casenumberId: cases.casenumberId,
        projectId: cases.projectId,
        statusId: cases.statusId,
        units: cases.units,
        owner: cases.owner,
        phoneOwner: cases.phoneOwner,
        checkInDate: cases.checkInDate,
        createdBy: req.userId,
      })
      await models.HomeCase.bulkCreate(data, {
        updateOnDuplicate: true,
        individualHooks: true,
      })
        .then((cases) => {
          console.log(cases)
          res.status(200).json({
            message: 'success insert',
            cases: cases
          })
        })
        .catch((error) => {
          console.log('Error: insert db' + error)
          res.status(401).end()
        })
    }
  } catch (error) {
    next(error);
  } finally {
    console.log('done trying')
  }
});
module.exports = router