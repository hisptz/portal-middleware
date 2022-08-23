require("dotenv").config();

const configurations = {
  username: process.env.USERNAME,
  id: process.env.USERID,
  password: process.env.PASSWORD,
  instance: process.env.INSTANCE,
  replaceKey: process.env.REPLACE_KEY,
};

module.exports = configurations;
