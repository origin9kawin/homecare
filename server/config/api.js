require('dotenv').config();

module.exports = {
  QUERY_MAX_OFFSET: parseInt(process.env.QUERY_MAX_OFFSET),
  QUERY_MIN_OFFSET: parseInt(process.env.QUERY_MIN_OFFSET),
  QUERY_MAX_LIMIT: parseInt(process.env.QUERY_MAX_LIMIT),
  QUERY_MIN_LIMIT: parseInt(process.env.QUERY_MIN_LIMIT),
}
