require("dotenv").config();

const configurations = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  instance: process.env.DHIS2_URL,
};

module.exports = configurations;
