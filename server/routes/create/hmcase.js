/**
 * verify user input
 * verify loginToken
 * insert into database
 */
const express = require('express');
const router = express.Router();
const models = require('../../models');
const api = require('../../config/api')
const Debug = require('debug')
const sequelize = require('sequelize');
const isEmpty = require('lodash.isempty');
// const faker = require('faker');
// const isEmpty = require('lodash.isempty');
const Joi = require('@hapi/joi');

router.get('/', async (req, res, next) => {
  const debug = Debug('!!!-----------> debug hmcase begin');
  debug(req.headers)
  debug(req.body)

  try {
    const schema = Joi.object().keys({
      offset: Joi.number().integer().min(api.QUERY_MIN_OFFSET).max(api.QUERY_MAX_OFFSET),
      limit: Joi.number().integer().min(api.QUERY_MIN_LIMIT).max(api.QUERY_MAX_LIMIT),
      order: Joi.string().regex(/^[adescADESC]{3,4}$/).required(),
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      const message = []
      message.push({
        message: 'Error: data input invalid, please try again',
        system: result.error
      })
      return res.status(400).json(message);
    }
    // continue 
    const pageination = {
      offset: req.body.offset,
      limit: req.body.limit,
    }
    const homeCares = await models.HomeProj.findAll({
      attributes: [
        'id',
        'name'
      ],
      include: [
        {
          model: models.HomeCase, as: 'xHomeCase',
          attributes: [
            'id',
            'statusId',
            'projectId',
            'catId',
            'subcatId',
            'units', 'casenumberId', 'issuerName', 'homecareName',
            [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('homecareInDate')), 'homecareInDate'],
          ],
          // group: 'something',
          include: [
            {
              model: models.HomeStatus, as: 'xHomeStatus',
              attributes: ['id', 'name']
            },
            {
              model: models.HomeCaseDet, as: 'xHomeCaseDet',
              attributes: ['id', 'statusId', 'description',
                [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('checkInDate')), 'checkInDate'],
                'checkDetail'],
              include: [
                {
                  model: models.HomeImage, as: 'xHomeImage',
                  attributes: ['id', 'mainimgtagId', 'fileName'],
                  include: [
                    {
                      model: models.HomeImgMainTag, as: 'xHomeImgMainTag',
                      attributes: ['id', 'name']
                    }
                  ]
                },
              ]
            },
            {
              model: models.HomeCate, as: 'xHomeCate',
              attributes: ['id', 'name']
            },
            {
              model: models.HomeSubCat, as: 'xHomeSubCat',
              attributes: ['id', 'name']
            },
            {
              model: models.HomePhone, as: 'xHomePhone_Issuer',
              attributes: ['id', 'number'],
              where: {
                homecareOwner: true
              }
            },
            {
              model: models.HomePhone, as: 'xHomePhone_Owner',
              attributes: ['id', 'number'],
              where: {
                homecareOwner: false
              }
            },

          ], // xHomeCase includes
        },
      ], // HomeProj include
      offset: pageination.offset,
      limit: pageination.limit, // n HomeProj
      order: [
        [
          { model: models.HomeCase, as: 'xHomeCase' },
          // { model: Project, as: 'Project' },
          // 'createdAt',
          'updatedAt',
          req.body.order,
          // 'ASC',
        ]
      ]
    }) // HomeProj model
      .then(async (projects) => {
        debug("project length: " + projects.length)
        // debug(projects)
        return await projects
        const projectList = []
        const caseList = []
        const statusList = []
        const projectRoot = []
        await projects.forEach(project => {
          console.log(project)
          // project.xHomeStatus.forEach(status => {
          //   statusList.push({
          //     status: [
          //       {
          //         id: status.id,
          //         name: status.name,
          //         // total: 20,
          //       },
          //     ]
          //   })
          // })
          projectList.push({
            id: project.id,
            name: project.name,
            status: [
              {
                name: "total",
                value: 200
              },
              {
                name: "Assign",
                value: 30
              }
            ]
            // status: statusList
          }) // projectList
          // project.HomeCase.forEach(homecase => {
          //   caseList.push({
          //     id: homecase.id,
          //     projectId: homecase.projectId,
          //   })
          // })

        });
        // console.log(projectList);
        projectRoot.push({
          projectList: projectList,
          // caseList: caseList,
        })
        return projectRoot
      })
      .then((projectResult) => {
        debug(projectResult)
        res.status(200).json(projectResult)
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
    res.end()
  }
  // ----------- ended
  debug('!!!-----------> debug end hmcase get request');
});
router.post('/', async (req, res, next) => {
  const debug = new Debug('--> start main category')
  // debug(req.headers)
  const maincase = req.body.maincase
  const subcase = req.body.maincase.caseDetail
  // debug(maincase)
  // debug(maincase.caseDetail.listsDefect)
  // res.status(200).json({
  // message: maincase.caseDetail
  // message: maincase
  // message: subcase
  // })
  if (true) {
    try {
      var casezero = [];
      !isEmpty(maincase.issuerPhone[1]) ? (issuerPhone1 = maincase.issuerPhone[1].number) : (issuerPhone1 = null)
      !isEmpty(maincase.homecarePhone[1]) ? (homecarePhone1 = maincase.homecarePhone[1].number) : (homecarePhone1 = null)
      casezero.push({
        projectId: maincase.projectId,
        units: maincase.units,
        issuerName: maincase.issuerName,
        issuerPhone0: maincase.issuerPhone[0].number,
        issuerPhone1: issuerPhone1,
        homecareName: maincase.homecareName,
        homecarePhone0: maincase.homecarePhone[0].number,
        homecarePhone1: homecarePhone1,
        homecareInDate: maincase.homecareInDate
      })
      var caseone = [];
      const statusId = '83f7e205-0825-4ae2-82c9-5c0dd9afa6a0'
      const listsDefectId = new Array('6ddbdb66-23f3-42fd-b215-28f5e06762f7', '6ddbdb66-23f3-42fd-b215-28f5e06762f7')
      // listsDefect.push({
      // })
      caseone.push({
        statusId: statusId,
        subcatId: subcase.subcatId,
        description: subcase.description,
        checkDetail: subcase.checkDetail,
        checkInDate: subcase.checkInDate,
        listsDefect: listsDefectId,
        remark: subcase.remark
      })
      debug(casezero)
      debug(caseone)
    } catch (error) {
      debug(error)
    } finally {
      debug('done')
    }
  } else {
    res.status(401).json({
      message: 'something is not true'
    })
  }
  // try {
  //   const maincase = req.body.maincase
  //   models.HomeCase.create({
  //     casenumberId: maincase.casenumberId,
  //     projectId: maincase.projectId,
  //     units: maincase.units,
  //     issuerName: maincase.issuerName,
  //     issuerPhone0: maincase.issuerPhone[0].number,
  //     homecareName: maincase.homecareName,
  //     homecarePhone0: maincase.homecarePhone[0].number,
  //     homecareInDate: maincase.homecareInDate,
  //     createdBy: req.userId,
  //     updateOnDuplicate: true,
  //     individualHooks: true,
  //   })
  //     .then((maincaseResult) => {
  //       debug(maincaseResult.get().id);
  //       maincaseResult.createHomeCaseDet({
  //         caseId: maincaseResult.get().id,
  //         statusId: maincase.caseDetail.statusId,
  //         catId: maincase.caseDetail.catId,
  //         subcatId: maincase.caseDetail.subcatId,
  //         // reasonId: maincase.caseDetail.reasonId,
  //         description: maincase.caseDetail.description,
  //         checkDetail: maincase.caseDetail.checkDetail,
  //         checkInDate: maincase.caseDetail.checkInDate,
  //         // signOwner: maincase.caseDetail.singOwner,
  //         listDefect: maincase.caseDetail.listDefect,
  //         remark: maincase.caseDetail.remark,
  //         // sla: maincase.caseDetail.sla,
  //         createdBy: req.userId,
  //       }).then((casedetResult) => {
  //         debug(casedetResult)
  //         res.status(200).json({
  //           message: {
  //             message: 'success created new case',
  //           }
  //         })
  //       })
  //         .catch((error) => {
  //           res.status(401).json({
  //             message: {
  //               message: 'data may duplicate 1',
  //               system: error
  //             }
  //           })
  //         })
  //     })
  //     .catch((error) => {
  //       debug('Error: insert db' + error)
  //       res.status(401).json({
  //         message: {
  //           message: 'data may duplicate 0',
  //           system: error
  //         }
  //       })
  //     })
  // } catch (error) {
  //   next(error);
  // } finally {
  //   debug('done trying')
  // }

});
module.exports = router