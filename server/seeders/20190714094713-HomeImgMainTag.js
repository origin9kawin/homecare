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
        name: 'Before',
        ordering: 1,
        subImgs: [
          {
            name: 'รูปหน้าห้อง'
          },
          {
            name: 'รูปมุมกว้าง'
          },
          {
            name: 'รูปผู้รับเหมาที่เข้าซ่อมงาน'
          },
          {
            name: 'รูปจุดที่เข้าแก้ไข'
          },
        ]
      },
      {
        name: 'Protection',
        ordering: 2,
      },
      {
        name: 'Doing',
        ordering: 3,
      },
      {
        name: 'Finished',
        ordering: 4,
      },
      {
        name: 'Signed',
        ordering: 5,
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
      })
    });
    var bravo = []
    images[0].subImgs.forEach(image => {
      bravo.push({
        id: uuidv4(),
        name: image.name,
        color: '#' + Math.floor(Math.random() * 0x1000000).toString(16),
        createdBy: createdBy,
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
          name: alpha[1].name,
          color: alpha[1].color,
          ordering: alpha[1].ordering,
          createdBy: alpha[1].createdBy,
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[2].name,
          color: alpha[2].color,
          ordering: alpha[2].ordering,
          createdBy: alpha[2].createdBy,
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[3].name,
          color: alpha[3].color,
          ordering: alpha[3].ordering,
          createdBy: alpha[3].createdBy,
        })
      ],
      [
        models.HomeImgMainTag.create({
          id: uuidv4(),
          name: alpha[4].name,
          color: alpha[4].color,
          ordering: alpha[4].ordering,
          createdBy: alpha[4].createdBy,
        })
      ]
    ) // promise
  }, // Sequelize
  down: async (queryInterface, Sequelize) => {

  }
};
