'use strict';
const models = require('../models')
const uuidv4 = require('uuid/v4');
const Promise = require('bluebird')
const faker = require('faker');
const Sequelize = require('sequelize')
const mock = require('../config/mock')
async function randomCaseDet() {
  const casedetId = await models.HomeCaseDet.findAll({
    attributes: ['id'],
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  })
    .then(async (result) => {
      return await result[0].get().id
    })
  return casedetId
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
    .then((result) => {
      return result[0].get().id
    })
  return user
}
async function randomImgTag() {
  const status = await models.HomeImgSubTag.findAll({
    attributes: ['id', 'mainimgtagId'],
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  }, {
      include: [
        {
          model: models.HomeImgMainTag,
          as: 'xHomeImgMainTag',
        }
      ]
    })
    .then(async (result) => {
      // console.log(result)
      let data = []
      data.push({
        subimgtagId: await result[0].get().id,
        mainimgtagId: await result[0].get().mainimgtagId,
      })
      return await data
    })
  return status
}
async function randomImgTagZero() {
  const status = await models.HomeImgMainTag.findAll({
    attributes: ['id', 'name'],
    // where: {
    //   id: '2bf1a7a9-8ca5-4e23-8c2f-0fd14a703359'
    // },
    order: [
      [Sequelize.literal('RAND()')]
    ],
    limit: 1,
  })
    .then(async (result) => {
      // console.log(result)
      const subimg = await models.HomeImgSubTag.findAll({
        attributes: ['id', 'name'],
        where: {
          mainimgtagId: result[0].get().id
        },
        order: [
          [Sequelize.literal('RAND()')]
        ],
        limit: 1,
      })
      let data = []
      data.push({
        mainimgtagId: await result[0].get().id,
      })
      if (subimg.length > 0) {
        data.push({
          subimgtagId: await subimg[0].get().id,
        })
      } else {
        data.push({
          subimgtagId: null,
        })
      }
      return data;
    })
    .then(async (result) => {
      // console.log(result);
      return result;
    })
  return status
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const random_imgtag = await randomImgTagZero();
    // console.log(random_imgtag[0].mainimgtagId);
    // console.log(random_imgtag[1].subimgtagId);
    const images = []
    for (let i = 0; i < mock.MOCK_DATA_GENERATE; i++) {
      const random_imgtag = await randomImgTagZero();
      var mainimgtagId = random_imgtag[0].mainimgtagId;
      var subimgtagId = random_imgtag[1].subimgtagId;
      images.push({
        casedetId: await randomCaseDet(),
        mainimgtagId: mainimgtagId,
        subimgtagId: subimgtagId,
        fileName: faker.name.firstName() + '.jpg',
        fileSize: faker.finance.mask(),
        fileType: 'jpeg',
        createdBy: await xcreatedBy(),
      })
    }
    const buildQueries = () => {
      let queries = [];
      images.forEach(img => {
        queries.push({
          casedetId: img.casedetId,
          mainimgtagId: img.mainimgtagId,
          subimgtagId: img.subimgtagId,
          fileName: img.fileName,
          fileType: img.fileName,
          fileSize: img.fileSize,
          createdBy: img.createdBy
        })
      })
      return queries;
    };
    const apiCall = (item) => {
      return new Promise(async (resolve, reject) => {
        await Promise.delay(1000);
        resolve(
          await models.HomeImage.create({
            id: uuidv4(),
            casedetId: item.casedetId,
            mainimgtagId: item.mainimgtagId,
            subimgtagId: item.subimgtagId,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            createdBy: item.createdBy
          })
        );
      });
    };
    const queries = buildQueries();
    return Promise.map(queries, async query => {
      // console.log(await apiCall(query));
      await apiCall(query);
    }, { concurrency: 5 }); // five at the time
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('HomeCate', null, {});
    await queryInterface.bulkDelete('HomeSubCat', null, {});
  }
};
