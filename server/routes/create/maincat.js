/**
 * verify user input
 * verify loginToken
 * insert category name etc... to database
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const Debug = require('debug')
// const uuidv4 = require('uuid/v4');

router.post('/', async (req, res, next) => {
  const debug = new Debug('--> start main category')
  debug(req.headers)
  try {
    var count = Object.keys(req.body.category).length;
    debug(count)
    if (count > 0) {
      req.body.category.forEach((main, i) => {
        debug(i + ': loop')
        debug(main)
        models.HomeCate.create({
          name: main.name,
          color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
          createdBy: req.userId,
          updateOnDuplicate: true,
          individualHooks: true,
        })
          .then((maincategory) => {
            main['subcategory'].forEach(sub => {
              maincategory.createHomeSubCat({
                name: sub.name,
                color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
                catId: maincategory.get().id,
                createdBy: req.userId,
              })
                .catch((error) => {
                  debug(error)
                  res.status(401).json({
                    message: {
                      message: 'data may duplicate 1',
                      // system: error
                    }
                  })
                })
            })
          })
          .catch((error) => {
            debug(error)
            // res.status(401).json({
            //   message: {
            //     message: 'data may duplicate 0',
            //     // system: error
            //   }
            // })
          })
      })
    }
  } catch (error) {
    next(error);
  } finally {
    debug('done')
  }
  debug('---> end')
});

module.exports = router
