require('dotenv').config();
module.exports = {
  QUERY_LIMIT: parseInt(process.env.QUERY_LIMIT),
  QUERY_ORDERING: parseInt(process.env.QUERY_ORDERING),
}
