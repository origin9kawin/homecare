'use strict';
const models = require('../models')
const uuidv4 = require('uuid/v4');
const Sequelize = require('sequelize')
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
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const images = [
      {
        name: 'Open',
        ordering: 1,
        selectAble: false,
      },
      {
        name: 'Checking',
        ordering: 2,
        selectAble: false,
      },
      {
        name: 'Before',
        ordering: 3,
        selectAble: true,
        subImgs: [
          {
            name: 'รูปหน้าห้อง',
            selectAble: true,
            ordering: 1,
          },
          {
            name: 'รูปมุมกว้าง',
            selectAble: true,
            ordering: 2,
          },
          {
            name: 'รูปผู้รับเหมาที่เข้าซ่อมงาน',
            selectAble: true,
            ordering: 3,
          },
          {
            name: 'รูปจุดที่เข้าแก้ไข',
            selectAble: true,
            ordering: 4,
          },
        ]
      },
      {
        name: 'Protection',
        ordering: 4,
        selectAble: true,
      },
      {
        name: 'Doing',
        ordering: 5,
        selectAble: true,
      },
      {
        name: 'Finished',
        ordering: 6,
        selectAble: true,
      },
      {
        name: 'Signed',
        ordering: 7,
        selectAble: true,
      },
    ]
    const createdBy = await xcreatedBy();
    var alpha = []
    images.forEach(image => {
      alpha.push({
        id: uuidv4(),
        name: image.name,
        ordering: image.ordering,
        color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
        createdBy: createdBy,
        selectAble: image.selectAble,
      })
    });
    var bravo = []
    images[2].subImgs.forEach(image => {
      bravo.push({
        id: uuidv4(),
        name: image.name,
        ordering: image.ordering,
        color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
        createdBy: createdBy,
        createdAt: new Date(),
        selectAble: image.selectAble,
      })
    });
    return Promise.all(
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[0].name,
          color: alpha[0].color,
          ordering: alpha[0].ordering,
          createdBy: alpha[0].createdBy,
          selectAble: alpha[0].selectAble,
          createdAt: new Date(),
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[1].name,
          color: alpha[1].color,
          ordering: alpha[1].ordering,
          createdBy: alpha[1].createdBy,
          selectAble: alpha[1].selectAble,
          createdAt: new Date(),
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[2].name,
          color: alpha[2].color,
          ordering: alpha[2].ordering,
          createdBy: alpha[2].createdBy,
          createdAt: new Date(),
          selectAble: alpha[2].selectAble,
          xHomeImgSubTag: bravo,
        }, {
            include: [{
              model: models.HomeImgSubTag,
              as: 'xHomeImgSubTag'
            }]
          })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[3].name,
          color: alpha[3].color,
          ordering: alpha[3].ordering,
          createdBy: alpha[3].createdBy,
          selectAble: alpha[3].selectAble,
          createdAt: new Date(),
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[4].name,
          color: alpha[4].color,
          ordering: alpha[4].ordering,
          createdBy: alpha[4].createdBy,
          createdAt: new Date(),
          selectAble: alpha[4].selectAble,
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[5].name,
          color: alpha[5].color,
          ordering: alpha[5].ordering,
          createdBy: alpha[5].createdBy,
          createdAt: new Date(),
          selectAble: alpha[5].selectAble,
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[6].name,
          color: alpha[6].color,
          ordering: alpha[6].ordering,
          createdBy: alpha[6].createdBy,
          selectAble: alpha[6].selectAble,
          createdAt: new Date(),
        })
      ],

    ) // promise
  }, // Sequelize
  down: async (queryInterface, Sequelize) => {

  }
};
