const express = require('express');
const router = express.Router();
const models = require('../../models');
const uuidv4 = require('uuid/v4');
const uploadConfig = require('../../config/upload');
const multer = require('multer');
const Debug = require('debug')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfig.UPLOAD_LOCATION);
  },
  filename: function (req, file, cb) {
    let storedFilename = uuidv4() + '-' + Date.now() + '.' + file.mimetype.split('/')[1];
    cb(null, storedFilename);
  }
});
const fileFilter = (req, file, cb) => {
  if (uploadConfig.UPLOAD_FILE_EXTENSION.indexOf(file.mimetype.split('/')[1]) > -1) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const uploadsMulter = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * uploadConfig.UPLOAD_FILESIZE
  },
  fileFilter: fileFilter
}).array('filesName', uploadConfig.UPLOAD_MAX_COUNT);
const Joi = require('@hapi/joi');
const schema = Joi.object().keys({
  caseId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
  statusId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
  remarks: Joi.string().required(),
  statusNext: Joi.string().regex(/^[truefals]{4,5}$/).required(),
  statusOrdering: Joi.string().regex(/^[0-9]{1,10}$/).required(),
});
const getnextstatusId = async (req, res) => {
  const debug = new Debug('---->getnextstatusId')
  const currentstatusOrdering = req.body.statusOrdering;
  const currentstatusId = req.body.statusId;
  const currentcaseId = req.body.caseId;
  const statusNext = req.body.statusNext;
  debug('\ncurrentcaseId: ' + currentcaseId);
  debug('\ncurrentstatusId: ' + currentstatusId);
  debug('\nstatusOrdering: ' + currentstatusOrdering);
  debug('\nstatusNext: ' + statusNext);
  var nextstatusOrdering = parseInt(currentstatusOrdering)
  if (statusNext == 'true') {
    nextstatusOrdering += 1
  }
  try {
    await models.HomeStatus.findAll({
      attributes: ['id', 'name', 'color', 'ordering', 'initState'],
      limit: 1, where: { ordering: nextstatusOrdering }
    })
      .then((statusResult) => {
        debug('\nstatus info: ' + JSON.stringify(statusResult))
        models.HomeCase.update({
          statusId: statusResult[0].id,
          updatedAt: new Date(),
          updatedBy: req.userId
        }, {
            where: {
              id: currentcaseId
            }
          })
          .then((caseResult) => {
            debug('\ncaseupdate Result: ' + JSON.stringify(caseResult))
            models.HomeImgMainTag.findAll({
              attributes: ['id', 'name'],
              limit: 1,
              include: [{
                model: models.HomeImgSubTag, as: 'xHomeImgSubTag',
                attributes: ['id', 'name']
              }],
              where: {
                ordering: nextstatusOrdering
              }
            })
              .then((imgtagResult) => {
                debug('\nimg tag by next order: ' + JSON.stringify(imgtagResult))
                debug('\nHomeImgSubTag' + JSON.stringify(imgtagResult[0].xHomeImgSubTag))
                debug('\nxHomeImgSubTag length: ' + imgtagResult[0].xHomeImgSubTag.length)
                if (imgtagResult[0].xHomeImgSubTag.length == 0) {
                  debug('\n subimg length == 0 then insert image right now')
                  var preparedInsertImages = [];
                  req.files.forEach(function (file, i) {
                    preparedInsertImages.push({
                      caseId: currentcaseId,
                      statusId: statusResult[0].id,
                      mainimgtagId: imgtagResult[0].id,
                      fileName: file.filename,
                      fileType: file.mimetype.split('/')[1],
                      fileSize: file.size,
                      createdAt: new Date(),
                      createdBy: req.userId,
                    });
                  }) // preparedInsertImages
                  models.HomeImage.bulkCreate(preparedInsertImages, {
                    updateOnDuplicate: ['updatedBy']
                  }).then((imageInsertResult) => {
                    let remarks = JSON.parse(req.body.remarks)
                    let preparedInsertDefects = []
                    remarks.map((remark) => {
                      preparedInsertDefects.push({
                        id: remark.id,
                        name: remark.name,
                        remark: remark.value,
                        updatedAt: new Date(),
                        updatedBy: req.userId
                      })
                    })
                    models.HomeListDefect.bulkCreate(preparedInsertDefects, {
                      updateOnDuplicate: ['remark', 'updatedBy', 'updatedAt']
                    })
                      .then((defectsResult) => {
                        debug('\ndefectsResult: ' + JSON.stringify(defectsResult))
                        var defects = []
                        defectsResult.forEach((resp) => {
                          defects.push({
                            name: resp.name,
                            remark: resp.remark
                          })
                        })
                        var images = []
                        imageInsertResult.forEach((resp) => {
                          var createdAt = new Date(resp.createdAt).getTime() / 1000;
                          images.push({ createdAt: createdAt, fileName: resp.fileName, statusId: statusResult[0].id });
                        })
                        var updatedStatus = {
                          id: statusResult[0].id,
                          name: statusResult[0].name,
                          color: statusResult[0].color,
                          ordering: statusResult[0].ordering
                        }
                        if (req.files.length == imageInsertResult.length) {
                          // setTimeout(() => {
                          res.status(200).json({
                            status: 200,
                            message: 'successfully upload',
                            caseId: currentcaseId,
                            images: images,
                            defects: defects,
                            updatedStatus: updatedStatus
                          })
                          // }, 2000);
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
                  }) // HomeImage
                } else {
                  debug('\n subimg length > 0: do something else before insert ')
                } //imgtagResult[0].xHomeImgSubTag.length == 0
              }) //imgtagResult
          }) //caseResult
      }) // statusResult
  } catch (error) {
    res.status(500).json({
      system: error
    })
  } finally {
    debug('\ndone')
  }
}
router.post('/', async (req, res, next) => {
  const debug = new Debug('-------> images upload')
  debug(req.headers)
  debug(req.body)
  // may fix later with multer
  const fs = require('fs');
  !fs.existsSync(uploadConfig.UPLOAD_LOCATION) && fs.mkdirSync(uploadConfig.UPLOAD_LOCATION);
  try {
    debug(uploadConfig.UPLOAD_FILE_EXTENSION);
    await uploadsMulter(req, res, (err) => {
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
        // break to another function
        getnextstatusId(req, res)
      } // main else
    }); // await
  } catch (error) {
    res.status(500).json({
      system: error
    })
  } finally {
    debug('done')
  }
});
module.exports = router
