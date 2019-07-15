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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfig.location);
  },
  filename: function (req, file, cb) {
    cb(null, req.body.casedetId + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});
const fileFilter = (req, file, cb) => {
  if (uploadConfig.fileExtension.indexOf(file.mimetype.split('/')[1]) > -1) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const uploads = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * uploadConfig.fileSize
  },
  fileFilter: fileFilter
}).array('filesName', uploadConfig.maxCount);
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  casedetId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required()
});
router.post('/', async (req, res, next) => {
  // may fix later with multer
  const fs = require('fs');
  !fs.existsSync(uploadConfig.location) && fs.mkdirSync(uploadConfig.location);
  try {
    await uploads(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log('multer error it self images count may greater limit: ' + err);
        res.status(400).json({
          message: 'Error: multipart'
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log('other error: ' + err);
        res.status(400).json({
          message: 'Error: others'
        });
      } else {
        if (req.files.length < 1) {
          console.log('missing image upload');
          res.status(400).json({
            message: 'missing image upload'
          })
          return
        }
        const joiResult = Joi.validate(req.body, schema);
        if (joiResult.error) {
          res.status(400).json({ message: 'Error: data input invalid, please try again' });
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
          console.log('bulkcreate error: ' + error);
          res.status(400).json({
            message: 'Error: bulk'
          })
        })
      }
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router
