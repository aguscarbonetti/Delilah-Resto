const Sequelize = require('sequelize');

const database = "delilah_resto";
const user = "root";
const host = "localhost";
const password = "";
const port = "";

const sequelize = new Sequelize(`mysql://${user}:${password}@${host}:/${database}`);

module.exports = sequelize;