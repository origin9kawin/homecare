/**
 * after verify loginToken
 * verify user input
 * image filter check { size, type }
 * image storage
 * bulk insert into database
 */

const express = require('express');
const router = express.Router();
const models = require('../../models');
const uploadConfig = require('../../config/upload');
const multer = require('multer');
const Debug = require('debug')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfig.UPLOAD_LOCATION);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.casedetId + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});
const fileFilter = (req, file, cb) => {
  if (uploadConfig.UPLOAD_FILE_EXTENSION.indexOf(file.mimetype.split('/')[1]) > -1) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const uploads = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * uploadConfig.UPLOAD_FILESIZE
  },
  fileFilter: fileFilter
}).array('filesName', uploadConfig.UPLOAD_MAX_COUNT);
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  casedetId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
  mainimgtagId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
  subimgtagId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
});
router.post('/', async (req, res, next) => {
  const debug = new Debug('-------> images upload')
  // may fix later with multer
  const fs = require('fs');
  !fs.existsSync(uploadConfig.UPLOAD_LOCATION) && fs.mkdirSync(uploadConfig.UPLOAD_LOCATION);
  try {
    debug(uploadConfig.UPLOAD_FILE_EXTENSION);
    await uploads(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        debug('multer error it self images count may greater limit: ' + err);
        res.status(400).json({
          message: 'Error: multipart',
          system: err
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        debug('other error: ' + err);
        res.status(400).json({
          message: 'Error: others',
          system: error

        });
      } else {
        if (req.files.length < 1) {
          debug('missing image upload');
          res.status(400).json({
            message: 'missing image upload',
            cause: 'extension may not allow',
            todo: 'take a look at .env'
          })
          return
        }
        const joiResult = Joi.validate(req.body, schema);
        if (joiResult.error) {
          res.status(400).json({
            message: 'Error: data input invalid, please try again',
            system: joiResult.error,
          });
          return
        }
        var data = [];
        req.files.forEach(function (file, i) {
          data.push({
            casedetId: req.body.casedetId,
            fileName: file.filename,
            fileType: file.mimetype.split('/')[1],
            fileSize: file.size,
            createdBy: req.userId
          });
        })
        models.HomeImage.bulkCreate(data, {
          updateOnDuplicate: ['updatedBy']
        }).then((response) => {
          var hmResult = []
          response.forEach((resp) => {
            hmResult.push({ fileName: resp.fileName });
          })
          if (req.files.length == response.length) {
            res.status(200).json({
              message: 'successfully upload',
              images: hmResult
            })
          } else {
            res.status(400).json({
              message: 'Error: mismatch bulk'
            })
          }
        }).catch((error) => {
          debug('bulkcreate error: ' + error);
          res.status(400).json({
            message: 'Error: bulk',
            system: error

          })
        })
      }
    });
  } catch (error) {
    res.status(500).json({
      system: error
    })
  } finally {
    debug('done')
    // res.end()
  }
});
module.exports = router
