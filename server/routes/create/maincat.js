/**
 * verify user input
 * verify loginToken
 * insert category name etc... to database
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
// const uuidv4 = require('uuid/v4');
router.post('/', async (req, res, next) => {
  try {
    // console.log(req.body.category)
    if (req.body.category.length > 1) {
      req.body.category.forEach((main, i) => {
        console.log(i + ': loop')
        console.log(main)
        models.HomeCate.create({
          name: main.name,
          createdBy: req.userId,
          updateOnDuplicate: true,
          individualHooks: true,
        })
          .then((maincategory) => {
            main['subcategory'].forEach(sub => {
              maincategory.createHomeSubCat({
                name: sub.name,
                catId: maincategory.get().id,
                createdBy: req.userId,
              })
                .catch((error) => {
                  res.status(401).end()
                  return
                })
            })
          })
          .catch((error) => {
            res.status(401).end()
            return
          })
      })
    }
  } catch (error) {
    next(error);
  } finally {
    console.log('done')
    res.status(401).end()
  }
});

module.exports = router
