const express = require('express');
const router = express.Router();
const models = require('../../models');
const api = require('../../config/api');
const Debug = require('debug');
const uuidv4 = require('uuid/v4');
const sequelize = require('sequelize');
const isEmpty = require('lodash.isempty');
const Joi = require('@hapi/joi');
router.get('/checking/', async (req, res) => {
  const schema = Joi.object().keys({
    limit: Joi.string().trim().regex(/^[0-9]{1,3}$/).required(),
    page: Joi.string().trim().regex(/^[0-9]{1,1000}$/).required(),
    order: Joi.string().regex(/^[adescADESC]{3,4}$/).required(),
    init: Joi.string().trim().regex(/^[0-1]{1}$/).required(),
  });
  const result = Joi.validate(req.query, schema);
  if (result.error) {
    const message = []
    message.push({
      message: 'Error: data input invalid, please try again',
      system: result.error
    })
    return res.status(400).json(message);
  }
  // continue 
  const debug = Debug('!!!-----------> debug hmcase begin');
  debug(req.query)
  debug(req.headers)
  debug(req.body)
  const page = {
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit),
    init: parseInt(req.query.init),
  }
  debug(page);
  try {
    await models.HomeStatus.findAll({
      attributes: ['id', 'ordering'],
    })
      .then(async (statusResult) => {
        const statusArray = await statusResult;
        let statusIds = []; statusArray.forEach((element, i) => { statusIds[i] = element.id; });
        var Op = sequelize.Op;
        let topResult = null;
        let offset = ((page.page - 1) * page.limit);
        if (page.init == 1) {
          topResult = await models.HomeCase.findAll({
            offset: offset,
            limit: page.limit,
            where: { statusId: { [Op.in]: statusIds, } },
            order: [['updatedAt', 'desc'], ['createdAt', 'asc']],
            attributes: ['id', 'statusId', 'projectId', 'catId', 'subcatId', 'units', 'casenumberId', 'issuerName',
              [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('createdAt')), 'createdAt'],
              [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('updatedAt')), 'updatedAt']],
            include: [
              { model: models.HomeImage, as: 'xHomeImage', attributes: ['statusId', [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('xHomeImage.createdAt')), 'createdAt']], order: [['createdAt', 'asc']] },
              { model: models.HomePhone, as: 'xHomePhone_Issuer', attributes: ['number', 'homecareOwner'], }
            ]
          })
            .then(async (caseResult) => {
              let imageCheckedId = statusResult.filter(status => status.ordering === 2)[0].id;
              let caseList = [];
              let imageCheckedDate = '';
              await caseResult.forEach(rs => {
                rs.xHomeImage.map((value) => {
                  if (value.statusId == imageCheckedId) {
                    imageCheckedDate = value.createdAt
                  }
                })
                let phoneIssuer = rs.xHomePhone_Issuer.filter(phone => phone.homecareOwner === false)[0].number;
                caseList.push({
                  id: rs.id,
                  statusId: rs.statusId,
                  projectId: rs.projectId,
                  catId: rs.catId,
                  subcatId: rs.subcatId,
                  units: rs.units,
                  casenumberId: rs.casenumberId,
                  issuerName: rs.issuerName,
                  xHomePhone_Issuer: phoneIssuer,
                  createdAt: rs.createdAt,
                  updatedAt: rs.updatedAt,
                  checkedAt: imageCheckedDate
                });
              })
              return caseList;
            })
        }
        if (page.init == 0) {
          topResult = await models.HomeCaseDet.findAll({
            offset: offset,
            limit: page.limit,
            where: { statusId: { [Op.in]: statusIds, } },
            order: [['updatedAt', 'desc'], ['createdAt', 'desc']],
            attributes: ['id', 'caseId', 'statusId',
              [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('createdAt')), 'createdAt'],
              [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('updatedAt')), 'updatedAt']
            ],
            include: [
              {
                model: models.HomeCase, as: 'xHomeCase',
                attributes: ['id', 'statusId', 'projectId', 'catId', 'subcatId', 'units', 'casenumberId', 'issuerName',
                  [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('xHomeCase.createdAt')), 'createdAt'],
                  [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('xHomeCase.updatedAt')), 'updatedAt']
                ],
                include: [
                  {
                    model: models.HomeImage, as: 'xHomeImage', attributes: ['statusId',
                      [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('xHomeCase->xHomeImage.createdAt')), 'createdAt']
                    ],
                  },
                  { model: models.HomePhone, as: 'xHomePhone_Issuer', attributes: ['number', 'homecareOwner'], }
                ]
              }
            ]
          })
            .then(async (casedetResult) => {
              let imageCheckedId = statusResult.filter(status => status.ordering === 2)[0].id;
              let caseList = [];
              await casedetResult.forEach(rs => {
                if (rs.xHomeCase.length > 0) {
                  let imageCheckedDate = rs.xHomeCase[0].xHomeImage.filter(image => image.statusId === imageCheckedId)[0].createdAt;
                  let phoneIssuer = rs.xHomeCase[0].xHomePhone_Issuer.filter(phone => phone.homecareOwner === false)[0].number;
                  caseList.push({
                    id: rs.xHomeCase[0].id,
                    casedetId: rs.id,
                    statusId: rs.statusId,
                    projectId: rs.xHomeCase[0].projectId,
                    catId: rs.xHomeCase[0].catId,
                    subcatId: rs.xHomeCase[0].subcatId,
                    units: rs.xHomeCase[0].units,
                    casenumberId: rs.xHomeCase[0].casenumberId,
                    issuerName: rs.xHomeCase[0].issuerName,
                    xHomePhone_Issuer: phoneIssuer,
                    createdAt: rs.xHomeCase[0].createdAt,
                    updatedAt: rs.xHomeCase[0].updatedAt,
                    checkedAt: imageCheckedDate
                  });
                }
              })
              return caseList;
            })
        }
        const projectRoot = {
          caseList: topResult,
        }
        res.status(200).json(projectRoot);
      })
  } catch (error) {
    debug(error)
    res.status(400).json({
      message: "Something is not right.",
      todo: "keep trying...",
      cheerup: "I 'll be with you.",
      system: error
    })
  } finally {
    debug('done')
  }
})
router.post('/statusUpdate/', async (req, res) => {
  const debug = Debug('!!!-----------> debug hmcase begin');
  debug(req.body)
  try {
    const schema = Joi.object().keys({
      caseId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      statusId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      casedetId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      const message = []
      message.push({
        message: 'Error: data input invalid, please try again',
        system: result.error
      })
      debug(result.error)
      return res.status(400).json(message);
    }
    // continue 
    await models.HomeCaseDet.update({
      statusId: req.body.statusId,
      updatedAt: new Date(),
      updatedBy: req.userId,
    }, {
        where: {
          id: req.body.casedetId
        }
      })
      .then(async (casedetResult) => {
        console.log(casedetResult);
        await models.HomeCase.update({
          statusId: req.body.statusId,
          updatedAt: new Date(),
          updatedBy: req.userId,
        }, {
            where: {
              id: req.body.caseId
            }
          })
          .then(async (caseResult) => {
            console.log(caseResult);
            res.status(200).json({
              status: 200,
              message: 'update successfully',
            })
          })
      })
  } catch (error) {
    debug(error)
    res.status(400).json({
      message: "Something is not right.",
      todo: "keep trying...",
      cheerup: "I 'll be with you.",
      system: error
    })
  } finally {
    debug('done statusUpdate')
  }
  // ----------- ended
  debug('!!!-----------> debug end hmcase get request');
});
router.post('/reasonUpdate/', async (req, res) => {
  const debug = Debug('!!!-----------> debug hmcase begin');
  debug(req.body)
  try {
    const schema = Joi.object().keys({
      caseId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      statusId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      casedetId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      data: Joi.string().optional().allow('').min(0).max(65535)
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      const message = []
      message.push({
        message: 'Error: data input invalid, please try again',
        system: result.error
      })
      debug(result.error)
      return res.status(400).json(message);
    }
    // continue 
    let checkboxs = [];
    let data = [];
    if (req.body.data.length > 0) {
      checkboxs = req.body.data.split(',');
      checkboxs.forEach(checkbox => {
        data.push({
          id: uuidv4(),
          caseId: req.body.caseId,
          casedetId: req.body.casedetId,
          statusId: req.body.statusId,
          reasonId: checkbox,
          createdBy: req.userId,
          createdAt: new Date(),
        })
      })
    }
    await models.HomeReasonDet.destroy({ where: { casedetId: req.body.casedetId } })
      .then(async (reasodetDeleteResult) => {
        // console.log(reasodetDeleteResult);
        if (req.body.data.length > 0) {
          await models.HomeReasonDet.bulkCreate(data)
            .then(async (resondetCreateResult) => {
              // console.log(resondetCreateResult);
              res.status(200).json({
                status: 200,
                message: 'update successfully',
              })
            })
        } else {
          res.status(200).json({
            status: 200,
            message: 'update successfully',
          })
        }
      })
  } catch (error) {
    debug(error)
    res.status(400).json({
      message: "Something is not right.",
      todo: "keep trying...",
      cheerup: "I 'll be with you.",
      system: error
    })
  } finally {
    debug('done statusUpdate')
  }
  // ----------- ended
  debug('!!!-----------> debug end hmcase get request');
});
router.get('/checkreview/', async (req, res) => {
  const debug = Debug('!!!-----------> debug hmcase begin');
  debug(req.query)
  try {
    const schema = Joi.object().keys({
      caseId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
    });
    const result = Joi.validate(req.query, schema);
    if (result.error) {
      const message = []
      message.push({
        message: 'Error: data input invalid, please try again',
        system: result.error
      })
      return res.status(400).json(message);
    }
    // continue 
    const page = {
      caseId: req.query.caseId,
    }
    await models.HomeCase.findAll({
      attributes: ['id', 'statusId', 'catId', 'subcatId', 'projectId', 'description', 'homecareName',
        [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('homecareInDate')), 'homecareInDate']
      ],
      where: {
        id: page.caseId,
      },
      include: [
        {
          model: models.HomeImage, as: 'xHomeImage',
          attributes: ['fileName', 'statusId', [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('xHomeImage.createdAt')), 'createdAt']]
        },
        {
          model: models.HomeListDefect, as: 'xHomeListDefect',
          attributes: ['id', 'name', 'remark', 'casedetId'],
          include: [
            {
              model: models.HomeCaseDet, as: 'xHomeCaseDet',
              attributes: ['statusId', 'assignedTo', [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('xHomeListDefect->xHomeCaseDet.createdAt')), 'createdAt']],
              include: [
                {
                  model: models.HomeReasonDet, as: 'xHomeReasonDet',
                  attributes: ['casedetId', 'reasonId']
                }
              ]
            }
          ]
        },
        {
          model: models.HomePhone, as: 'xHomePhone_Owner', attributes: ['number'],
          where: { homecareOwner: true }
        },
        {
          model: models.HomePhone, as: 'xHomePhone_Issuer', attributes: ['number'],
          where: { homecareOwner: false }
        },
      ]
    })
      .then(async (caseResult) => {
        const projectRoot = {
          caseDetail: await caseResult,
        }
        debug(JSON.stringify(projectRoot));
        return projectRoot;
      })
      .then((response) => {
        setTimeout(() => {
          res.status(200).json(response)
        }, 0)
      })
  } catch (error) {
    debug(error)
    res.status(400).json({
      message: "Something is not right.",
      todo: "keep trying...",
      cheerup: "I 'll be with you.",
      system: error
    })
  } finally {
    debug('done')
  }
  // ----------- ended
  debug('!!!-----------> debug end hmcase get request');
});
router.post('/assigning/', async (req, res) => {
  const debug = Debug('!!!-----------> debug hmcase begin');
  debug(req.headers)
  debug(req.body)
  try {
    const schema = Joi.object().keys({
      caseId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      statusId: Joi.string().trim().regex(/^[a-zA-Z0-9-]{36}$/).required(),
      responsible: Joi.string().required(),
      statusNext: Joi.string().regex(/^[truefals]{4,5}$/).required(),
      statusOrdering: Joi.string().regex(/^[0-9]{1,10}$/).required(),
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      debug(result.error)
      const message = []
      message.push({
        message: 'Error: data input invalid, please try again',
        system: result.error
      })
      return res.status(400).json(message);
    }
    const { caseId, statusId, statusNext, statusOrdering, responsible } = req.body;
    const currentstatusOrdering = statusOrdering;
    const currentstatusId = statusId;
    const currentcaseId = caseId;
    debug('\ncurrentcaseId: ' + currentcaseId);
    debug('\ncurrentstatusId: ' + currentstatusId);
    debug('\nstatusOrdering: ' + currentstatusOrdering);
    debug('\nstatusNext: ' + statusNext);
    var nextstatusOrdering = parseInt(currentstatusOrdering)
    if (statusNext == 'true') { nextstatusOrdering += 1 }
    await models.HomeStatus.findAll({
      attributes: ['id', 'name', 'color', 'ordering'],
      limit: 1, where: { ordering: nextstatusOrdering }
    })
      .then(async (statusCaseResult) => {
        debug('\nstatusCaseResult: ' + JSON.stringify(statusCaseResult));
        await models.HomeStatus.findAll({
          attributes: ['id'],
          // limit: 1, where: { initState: 0 }, order: [['ordering', 'ASC']].
          limit: 1, where: { ordering: nextstatusOrdering }
        })
          .then(async (statusCasedetResult) => {
            debug('\nstatusCasedetResult: ' + JSON.stringify(statusCasedetResult));
            await models.HomeCase.findAll({
              attributes: ['catId', 'subcatId'], where: { id: currentcaseId, statusId: currentstatusId }, limit: 1,
            })
              .then(async (caseReadResult) => {
                debug('\ncaseReadResult: ' + JSON.stringify(caseReadResult));
                await models.HomeCase.update({
                  statusId: statusCaseResult[0].id,
                  updatedAt: new Date(),
                  updatedBy: req.userId,
                }, {
                    where: {
                      id: currentcaseId
                    }
                  })
                  .then(async (caseUpdateResult) => {
                    debug('\ncaseUpdateResult: ' + JSON.stringify(caseUpdateResult));
                    const assignResp = JSON.parse(responsible);
                    console.log(typeof assignResp);
                    Object.keys(assignResp).forEach(function (element) {
                      console.log(element, assignResp[element]);
                      models.HomeCaseDet.create({
                        id: uuidv4(),
                        caseId: currentcaseId,
                        statusId: statusCasedetResult[0].id,
                        catId: caseReadResult[0].catId,
                        subcatId: caseReadResult[0].subcatId,
                        assignedTo: assignResp[element],
                        createdAt: new Date(),
                        createdBy: req.userId,
                      }).then((casedetCreatedResult) => {
                        debug('\ncasedetCreatedResult: ' + JSON.stringify(casedetCreatedResult));
                        models.HomeListDefect.update({
                          casedetId: casedetCreatedResult.id,
                          updatedAt: new Date(),
                          updatedBy: req.userId,
                        }, {
                            where: {
                              id: element,
                            }
                          })
                          .then((listResult) => {
                            debug('\nlistResult: ' + JSON.stringify(listResult));
                          })
                      })
                    })
                    var updatedStatus = {
                      id: statusCaseResult[0].id,
                      name: statusCaseResult[0].name,
                      color: statusCaseResult[0].color,
                      ordering: statusCaseResult[0].ordering
                    }
                    res.status(200).json({
                      status: 200,
                      message: 'successfully assigned',
                      updatedStatus: updatedStatus
                    })
                  })
              })
          })
      })
  } catch (error) {
    debug(error)
    res.status(400).json({
      message: "Something is not right.",
      todo: "keep trying...",
      cheerup: "I 'll be with you.",
      system: error
    })
  } finally {
    debug('done')
  }
});
module.exports = router