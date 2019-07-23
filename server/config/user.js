require('dotenv').config();

module.exports = {
  EXPIRE_TOKEN_VERIFY: process.env.EXPIRE_TOKEN_VERIFY,
  EXPIRE_TOKEN_LOGIN: process.env.EXPIRE_TOKEN_LOGIN,
  USER_DEFAULT_VISIBLE: parseInt(process.env.USER_DEFAULT_VISIBLE),
  LENGTH_MAX_USER_SIGNUP: parseInt(process.env.LENGTH_MAX_USER_SIGNUP),
  LENGTH_MIN_USER_SIGNUP: parseInt(process.env.LENGTH_MIN_USER_SIGNUP),
  LENGTH_MAX_PWD_SIGNUP: parseInt(process.env.LENGTH_MAX_PWD_SIGNUP),
  LENGTH_MIN_PWD_SIGNUP: parseInt(process.env.LENGTH_MIN_PWD_SIGNUP),
  // SECRETKEY: "h0m$C@&$",
  SECRETKEY: process.env.SECRET_KEY,
}
