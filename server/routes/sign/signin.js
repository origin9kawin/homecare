const express = require('express');
const router = express.Router();
const models = require('../../models');
const User = require('../../config/user');
const api = require('../../config/api')
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const md5 = require('md5');
const Debug = require('debug');
const sequelize = require('sequelize');
const schema = Joi.object().keys({
  username: Joi.string().trim().min(User.LENGTH_MIN_USER_SIGNUP).max(User.LENGTH_MAX_PWD_SIGNUP).required(),
  password: Joi.string().trim().required(), // TODO
  loginCount: Joi.string().regex(/^[0-9]{0,65535}$/).required(),
  buttonPressedCount: Joi.string().regex(/^[0-9]{0,65535}$/).required(),
});
router.get('/', (req, res) => res.status(403).send('hello world'));
router.post('/', async (req, res, next) => {
  const debug = Debug('!!!-----------> debug begin signin');
  debug(req.body)
  try {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      debug(result.error)
      res.status(400).json({
        status: 400,
        message: {
          message: 'Error: data input invalid, please try again',
          show: 'Invalid / Missing params',
          system: result.error
        }
      });
      return
    }
    const myPlainTextPassword = req.body.password;
    await models.HomeUser.findOne({
      attributes: [
        'id', 'hashPwd',
        [sequelize.Sequelize.fn('UNIX_TIMESTAMP', sequelize.Sequelize.col('userExpiredAt')), 'userExpiredAt']
      ],
      where: {
        username: req.body.username,
        visible: 1
      }
    }).then(async (homeuserResult) => {
      if (!homeuserResult) {
        res.status(404).json({
          status: 404,
          message: {
            message: 'user not found / active yet',
            show: 'Not found, please try again'
          }
        });
        return
      }
      var now = Math.floor(Date.now() / 1000);
      var userExpiredAt = homeuserResult.get().userExpiredAt;
      if (userExpiredAt < now) {
        res.status(401).json({
          status: 401,
          message: {
            message: 'user is expired',
            show: 'Expire, please report'
          }
        });
        return
      }
      const bcryptResut = await bcrypt.compare(myPlainTextPassword, homeuserResult.get().hashPwd);
      debug(bcryptResut);
      if (bcryptResut.error) {
        res.status(500).json({
          status: 500,
          message: 'Error: crypting'
        })
        return
      }
      if (!bcryptResut) {
        res.status(403).json({
          status: 403,
          message: {
            message: 'Error: crypting mismatch',
            show: 'Invalid, please try again.',
            system: bcryptResut
          }
        })
        return
      }
      const jwt = require('jsonwebtoken');
      var signOptions = {};
      const ms = require('ms');
      signOptions.expiresIn = ms(User.EXPIRE_TOKEN_LOGIN) / 1000; // verifyToken expire
      const userId = homeuserResult.get().id;
      const jwtResult = jwt.sign({ id: userId, }, User.SECRETKEY, signOptions);
      debug(jwtResult);
      if (jwtResult.error) {
        res.status(500).json({
          status: 500,
          message: 'Error: tokening'
        })
        return
      }
      // update loginToken
      const page = {
        limit: api.QUERY_LIMIT,
        order: api.QUERY_ORDERING,
        page: 1,
      }
      await models.HomeUser.update({
        loginToken: jwtResult
      }, {
          where: {
            id: userId
          }
        })
        .then(homeuserResult => {
          if (homeuserResult) {
            models.HomeStatus.findAll({
              attributes: ['id', 'name', 'desc', 'color', 'initState', 'ordering', 'filterAble', 'selectAble', 'reasonBtn']
            })
              .then(statusResult => {
                models.HomeProj.findAll({
                  attributes: ['id', 'name']
                })
                  .then(homeprojResult => {
                    models.HomeCate.findAll({
                      attributes: ['id', 'name', 'slaDay']
                    })
                      .then(cateResult => {
                        models.HomeSubCat.findAll({
                          attributes: ['id', 'name', 'maincatId', 'slaDay']
                        })
                          .then(subcatResult => {
                            models.HomeReason.findAll({
                              attributes: ['id', 'name', 'ordering']
                            })
                              .then(reasonResult => {
                                models.HomeImgMainTag.findAll({
                                  attributes: ['id', 'name', 'ordering', 'selectAble']
                                })
                                  .then(imgmaintagResult => {
                                    models.HomeImgSubTag.findAll({
                                      attributes: ['id', 'name', 'mainimgtagId', 'selectAble', 'ordering']
                                    })
                                      .then(imgsubtagResult => {
                                        models.HomeUser.findAll({
                                          attributes: ['firstname', 'email', 'id'],
                                          where: {
                                            role: 3,
                                          }
                                        })
                                          .then((technicianResult) => {
                                            res.status(200).json({
                                              status: 200,
                                              message: {
                                                message: 'successfully login',
                                                show: 'Login Again'
                                                // show: 'Login success'
                                              },
                                              credential: {
                                                userId: userId,
                                                accessToken: jwtResult, // random token with expiration
                                              },
                                              dataSource: {
                                                status: statusResult,
                                                project: homeprojResult,
                                                cate: cateResult,
                                                subcat: subcatResult,
                                                reason: reasonResult,
                                                imgmaintag: imgmaintagResult,
                                                imgsubtag: imgsubtagResult,
                                                technician: technicianResult,
                                                md5sum: [
                                                  {
                                                    name: "status",
                                                    value: md5(statusResult),
                                                  },
                                                  {
                                                    name: "project",
                                                    value: md5(homeprojResult),
                                                  },
                                                  {
                                                    name: "cate",
                                                    value: md5(cateResult),
                                                  },
                                                  {
                                                    name: "subcat",
                                                    value: md5(subcatResult),
                                                  },
                                                  {
                                                    name: "reason",
                                                    value: md5(reasonResult),
                                                  },
                                                  {
                                                    name: "imgmaintag",
                                                    value: md5(imgmaintagResult),
                                                  },
                                                  {
                                                    name: "imgsubtag",
                                                    value: md5(imgsubtagResult),
                                                  },
                                                  {
                                                    name: "technician",
                                                    value: md5(technicianResult),
                                                  }
                                                ]
                                              },
                                            })
                                          })
                                      })
                                  })
                              })
                          })
                      })
                  })
              })
          } else {
            res.status(500).json({
              status: 500,
              message: {
                message: 'update failed',
              }
            });
          }
        })
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: {
        message: 'there is something wrong',
      }
    });
  } finally {
    debug('done trying')
  }
  debug('!!!-----------> debug end signin');
});
module.exports = router
