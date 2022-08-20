require("dotenv").config();

const configurations = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  instance: "155.12.29.42:8080",
};

module.exports = configurations;
