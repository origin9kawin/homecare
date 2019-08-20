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
        subcatId: await result[0].get().id,
        catId: await result[0].get().maincatId,
      })
      return await data
    })
  return status
}
async function randomStatus() {
  const status = await models.HomeStatus.findAll({
    attributes: ['id'],
    where: {
      ordering: 1,
    },
    // order: [
    //   [Sequelize.literal('RAND()')]
    // ],
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
async function randomImgTagZero() {
  const status = await models.HomeImgMainTag.findAll({
    attributes: ['id', 'name'],
    where: {
      ordering: 1,
    },
    limit: 1,
  })
    .then(async (result) => {
      let data = []
      data.push({
        mainimgtagId: await result[0].get().id,
      })
      return data;
    })
    .then(async (result) => {
      return result;
    })
  return status
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const homecases = []
    for (let i = 0; i < mock.MOCK_DATA_GENERATE_CASE; i++) {
      const random_cat = await randomCats();
      const random_status = await randomStatus();
      const random_proj = await randomProj();
      const random_creater = await xcreatedBy();
      const random_imgtag = await randomImgTagZero();

      var catId = random_cat[0].catId;
      var subcatId = random_cat[0].subcatId;
      var mainimgtagId = random_imgtag[0].mainimgtagId;
      var statusId = random_status;
      var projId = random_proj;
      var creater = random_creater;
      let issuerPhone = [];
      let ownerPhone = [];
      let listDefects = []
      let images = [];
      for (let j = 0; j < mock.MOCK_DATA_GENERATE_PHONE; j++) {
        issuerPhone.push({
          number: faker.address.zipCode(),
          color: faker.internet.color(),
        })
        ownerPhone.push({
          number: faker.address.zipCode(),
          color: faker.internet.color(),
        })
      } // child gen
      for (let j = 0; j < mock.MOCK_DATA_GENERATE_DEFECT; j++) {
        listDefects.push({
          name: faker.name.findName(),
          remark: faker.name.findName(),
          color: faker.internet.color(),
        })
      } // child gen
      for (let k = 0; k < mock.MOCK_DATA_GENERATE_IMAGE; k++) {
        images.push({
          statusId: statusId,
          mainimgtagId: mainimgtagId,
          // fileName: faker.name.firstName() + '.jpg',
          fileName: 'a.jpg',
          fileSize: faker.finance.mask(),
          fileType: 'jpeg',
        })
      }
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
        description: faker.lorem.sentences(),
        checkInDate: faker.date.past(),
        remark: faker.lorem.word(),
        listDefects: listDefects,
        createdBy: creater,
        images: images,
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
        hmcase.listDefects.forEach(def => {
          defectes.push({
            name: def.name,
            remark: def.remark,
            color: def.color,
            createdBy: creater,
          })
        })
        let images = [];
        hmcase.images.forEach(img => {
          images.push({
            statusId: img.statusId,
            mainimgtagId: img.mainimgtagId,
            subimgtagId: img.subimgtagId,
            fileName: img.fileName,
            fileSize: img.fileSize,
            fileType: img.fileType,
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
          description: hmcase.description,
          checkInDate: hmcase.checkInDate,
          remark: hmcase.remark,
          listDefects: defectes,
          images: images,
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
            .create({
              createdAt: new Date(),
              createdBy: creater
            })
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
                  catId: item.catId,
                  subcatId: item.subcatId,
                  statusId: item.statusId,
                  units: item.units,
                  issuerName: item.issuer.name,
                  homecareName: item.homecareOwner.name,
                  homecareInDate: item.homecareOwner.moveinDate,
                  description: item.description,
                  createdBy: creater,
                  createdAt: new Date(),
                  // updatedAt: new Date()
                },
                limit: 1,
              })
                .then(async (rst, created) => {
                  // console.log(rst);
                  if (!created) {
                    let caseId = rst[0].id
                    console.log(caseId);

                    var data = [];
                    item.listDefects.forEach(function (def) {
                      data.push({
                        id: uuidv4(),
                        name: def.name,
                        color: def.color,
                        remark: def.remark,
                        createdBy: item.createdBy,
                        caseId: caseId,
                        createdAt: new Date(),
                      });
                    })
                    await models.HomeListDefect.bulkCreate(data, {
                      updateOnDuplicate: ['caseId', 'name']
                    })


                    var data = [];
                    item.issuer.phone.forEach(function (isPhone) {
                      data.push({
                        id: uuidv4(),
                        number: isPhone.number,
                        color: isPhone.color,
                        createdBy: item.createdBy,
                        homecareOwner: false,
                        caseId: caseId,
                        createdAt: new Date(),
                        // updatedAt: new Date()
                      });
                    })
                    await models.HomePhone.bulkCreate(data, {
                      updateOnDuplicate: ['caseId', 'number']
                    })

                    var data = [];
                    item.homecareOwner.phone.forEach(function (isPhone) {
                      data.push({
                        id: uuidv4(),
                        number: isPhone.number,
                        color: isPhone.color,
                        createdBy: item.createdBy,
                        homecareOwner: true,
                        caseId: caseId,
                        createdAt: new Date(),
                        // updatedAt: new Date()

                      });
                    })
                    await models.HomePhone.bulkCreate(data, {
                      updateOnDuplicate: ['caseId', 'number']
                    })

                    var data = [];
                    item.images.forEach(function (image) {
                      data.push({
                        id: uuidv4(),
                        caseId: caseId,
                        statusId: image.statusId,
                        mainimgtagId: image.mainimgtagId,
                        subimgtagId: image.subimgtagId,
                        fileName: image.fileName,
                        fileSize: image.fileSize,
                        fileType: image.fileType,
                        createdBy: item.createdBy,
                        createdAt: new Date(),
                      })
                    })
                    await models.HomeImage.bulkCreate(data, {
                      updateOnDuplicate: ['caseId']
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
  }
};
