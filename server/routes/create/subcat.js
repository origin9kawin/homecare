const express = require('express');
const router = express.Router();
const models = require('../../models');
router.post('/', async (req, res, next) => {
  try {
    if (req.body.subcategory.length > 1) {
      req.body.subcategory.forEach((main) => {
        models.HomeSubCat.create({
          name: main.name,
          catId: main.catId,
          createdBy: req.userId,
          updateOnDuplicate: true,
          individualHooks: true,
        }).catch((error) => {
          console.log('Error: insert db')
          res.status(401).end()
          return
        })
      })
    }
  } catch (error) {
    next(error);
  } finally {
    console.log('done trying')
    res.status(401).end()
  }
});
module.exports = router