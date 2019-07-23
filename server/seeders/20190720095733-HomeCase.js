'use strict';
const models = require('../models')
const uuidv4 = require('uuid/v4');
const Promise = require('bluebird')
const faker = require('faker');
const Sequelize = require('sequelize')
const mock = require('../config/mock')
async function randomCats() {
  const status = await models.HomeSubCat.findAll({
    attributes: ['id', 'maincatId'],
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  }, {
      include: [
        {
          model: models.HomeCat,
          as: 'xHomeCat',
        }
      ]
    })
    .then(async (result) => {
      // console.log(result)
      let data = []
      data.push({
        catId: await result[0].get().id,
        subcatId: await result[0].get().maincatId,
      })
      return await data
    })
  return status
}
async function randomStatus() {
  const status = await models.HomeStatus.findAll({
    attributes: ['id'],
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  })
    .then(async (result) => {
      return await result[0].get().id
    })
  return status
}
async function xcreatedBy() {
  const user = await models.HomeUser.findAll({
    attributes: ['id'],
    where: {
      visible: true,
    },
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  })
    .then(async (result) => {
      return await result[0].get().id
    })
  return user
}
async function randomProj() {
  const proj = await models.HomeProj.findAll({
    attributes: ['id'],
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  })
    .then(async (result) => {
      return await result[0].get().id
    })
  return proj
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const homecases = []
    for (let i = 0; i < mock.MOCK_DATA_GENERATE; i++) {
      const random_cat = await randomCats();
      // const random_status = await randomStatus();
      // const random_proj = await randomProj();
      // console.log(random_cat[0].catId)
      // console.log(random_cat[0].subcatId)
      // console.log(random_status[0].id)
      // console.log(random_proj[0].id)
      var catId = random_cat[0].catId;
      var subcatId = random_cat[0].subcatId;
      var statusId = await randomStatus();
      var projId = await randomProj();
      var creater = await xcreatedBy();
      // var creater = '11111';
      let issuerPhone = [];
      let ownerPhone = [];
      let listDefects = []
      for (let j = 0; j < mock.MOCK_DATA_GENERATE_PHONE; j++) {
        issuerPhone.push({
          number: faker.phone.phoneNumber(),
          color: faker.internet.color(),
          createdBy: creater,
        })
        ownerPhone.push({
          number: faker.phone.phoneNumber(),
          color: faker.internet.color(),
          createdBy: creater,
        })
      } // child gen
      for (let j = 0; j < mock.MOCK_DATA_GENERATE_DEFECT; j++) {
        listDefects.push({
          name: faker.name.findName(),
          color: faker.internet.color(),
          createdBy: creater,
        })
      } // child gen
      homecases.push({
        projId: projId,
        statusId: statusId,
        catId: catId,
        subcatId: subcatId,
        units: "A" + faker.random.number(),
        issuer: {
          name: faker.name.findName(),
          phone: issuerPhone,
          createdBy: creater,
        },
        homecareOwner: {
          name: faker.name.findName(),
          moveinDate: faker.date.past(),
          phone: ownerPhone,
          createdBy: creater,
        },
        caseDetail: {
          description: faker.lorem.sentence(),
          checkDetail: faker.lorem.sentences(),
          checkInDate: faker.date.past(),
          remark: faker.lorem.word(),
          // slaDay: 1,
          listDefects: listDefects,
        },
        createdBy: creater,
      })
    }
    // end data structure
    // console.log(JSON.stringify(homecases));
    // return
    const buildQueries = () => {
      let queries = [];
      // console.log(JSON.stringify(homecases));
      homecases.forEach(hmcase => {
        // console.log(hmcase.units);
        let issPhone = []
        hmcase.issuer.phone.forEach(isphone => {
          issPhone.push({
            number: isphone.number,
            color: isphone.color,
            createdBy: creater,
          })
        })
        let ownPhone = []
        hmcase.homecareOwner.phone.forEach(owPhone => {
          ownPhone.push({
            number: owPhone.number,
            color: owPhone.color,
            createdBy: creater,
          })
        })
        let defectes = []
        hmcase.caseDetail.listDefects.forEach(def => {
          defectes.push({
            name: def.name,
            color: def.color,
            createdBy: creater,
          })
        })
        queries.push({
          projId: hmcase.projId,
          statusId: hmcase.statusId,
          catId: hmcase.catId,
          subcatId: hmcase.subcatId,
          units: hmcase.units,
          issuer: {
            name: hmcase.issuer.name,
            phone: issPhone,
          },
          homecareOwner: {
            name: hmcase.homecareOwner.name,
            moveinDate: hmcase.homecareOwner.moveinDate,
            phone: ownPhone,
          },
          caseDetail: {
            description: hmcase.caseDetail.description,
            checkDetail: hmcase.caseDetail.checkDetail,
            checkInDate: hmcase.caseDetail.checkInDate,
            remark: hmcase.caseDetail.remark,
            listDefects: defectes,
          },
          createdBy: creater,
        })
      })
      // console.log(JSON.stringify(queries));
      return queries;
    };
    const apiCall = (item) => {
      return new Promise(async (resolve, reject) => {
        await Promise.delay(1000);
        resolve(
          models.HomeCaseNumber
            .create()
            .then(async (result) => {
              // console.log('id: ' + result.get().id);
              return await result.get().id
            })
            .then(async (increment) => {
              await models.HomeCase.findOrCreate({
                attributes: ['id'],
                where: {
                  units: item.units,
                },
                defaults: {
                  id: uuidv4(),
                  casenumberId: increment,
                  projectId: item.projId,
                  units: item.units,
                  issuerName: item.issuer.name,
                  homecareName: item.homecareOwner.name,
                  homecareInDate: item.homecareOwner.moveinDate,
                  catId: item.catId,
                  statusId: item.statusId,
                  subcatId: item.subcatId,
                  createdBy: creater,
                },
                limit: 1,
              })
                .then(async (result, created) => {
                  if (!created) {
                    await models.HomeCaseDet.create({
                      id: uuidv4(),
                      description: item.caseDetail.description,
                      checkInDate: item.caseDetail.checkInDate,
                      checkDetail: item.caseDetail.checkDetail,
                      remark: item.remark,
                      createdBy: item.createdBy,
                      slaDay: item.slaDay,
                      catId: item.catId,
                      statusId: item.statusId,
                      subcatId: item.subcatId,
                      caseId: result[0].get().id
                    })
                      .then(async (rst, created) => {
                        let casedetId = rst.get().id
                        if (!created) {
                          var data = [];
                          item.caseDetail.listDefects.forEach(function (def) {
                            data.push({
                              id: uuidv4(),
                              name: def.name,
                              color: def.color,
                              createdBy: item.createdBy,
                              casedetId: casedetId,
                              // TODO
                              // caseId: result[0].get().id
                            });
                          })
                          return await models.HomeListDefect.bulkCreate(data, {
                            updateOnDuplicate: ['caseId', 'casedetId', 'name']
                          })
                        }
                      })
                  }
                  if (!created) {
                    var data = [];
                    item.issuer.phone.forEach(function (isPhone) {
                      data.push({
                        id: uuidv4(),
                        number: isPhone.number,
                        color: isPhone.color,
                        createdBy: item.createdBy,
                        homecareOwner: false,
                        caseId: result[0].get().id
                      });
                    })
                    await models.HomePhone.bulkCreate(data, {
                      updateOnDuplicate: ['caseId', 'number']
                    })
                  }
                  if (!created) {
                    var data = [];
                    item.homecareOwner.phone.forEach(function (isPhone) {
                      data.push({
                        id: uuidv4(),
                        number: isPhone.number,
                        color: isPhone.color,
                        createdBy: item.createdBy,
                        homecareOwner: true,
                        caseId: result[0].get().id
                      });
                    })
                    await models.HomePhone.bulkCreate(data, {
                      updateOnDuplicate: ['caseId', 'number']
                    })
                  }
                })
            })

        ); // resolve
      });
    };
    const queries = buildQueries();
    return Promise.map(queries, async query => {
      // console.log('apicall' + await apiCall(query));
      await apiCall(query);
    }, { concurrency: 5 }); // five at the time

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('HomeCase', null, {});
    await queryInterface.bulkDelete('HomeCaseDet', null, {});
  }
};
