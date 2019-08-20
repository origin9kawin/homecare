const express = require('express');
const router = express.Router();
const models = require('../../models');
router.post('/', async (req, res, next) => {
  try {
    console.log(models.HomeCaseDet)
    if (req.body.casedetail.length == 1) {
      var caseDet = req.body.casedetail[0];
      var data = []
      data.push({
        caseId: caseDet.caseId,
        catId: caseDet.catId,
        subcatId: caseDet.subcatId,
        statusId: caseDet.statusId,
        reasonId: caseDet.reasonId,
        description: caseDet.description,
        homecareName: caseDet.homecareName,
        homecareInDate: caseDet.homecareInDate,
        checkDetail: caseDet.checkDetail,
        singOwner: caseDet.singOwner,
        listDefect: caseDet.listDefect,
        remark: caseDet.remark,
        slaDay: caseDet.slaDay,
        createdBy: req.userId,
      })
      await models.HomeCaseDet.bulkCreate(data, {
        updateOnDuplicate: true,
        individualHooks: true,
      })
        .then((casedetail) => {
          console.log(casedetail)
          res.status(200).json({
            message: 'success insert',
            casedetail: casedetail
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