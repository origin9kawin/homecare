require('dotenv').config();

module.exports = {
  MOCK_DATA_GENERATE: parseInt(process.env.MOCK_DATA_GENERATE),
  MOCK_DATA_GENERATE_PHONE: parseInt(process.env.MOCK_DATA_GENERATE_PHONE),
  MOCK_DATA_GENERATE_DEFECT: parseInt(process.env.MOCK_DATA_GENERATE_DEFECT),
}
