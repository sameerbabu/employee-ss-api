"use strict";

const Sequelize = require("sequelize");
const {Umzug, SequelizeStorage} = require("umzug");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];
const db = {};

let sequelize;
sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Employees = require("./employees.model.js")(sequelize, Sequelize);
db.Users = require("./users.model.js")(sequelize, Sequelize);

/*****
 * Because this is standalone DB, and is expected to be deleted and recreated with the server
 *  Using Sync to create tables if they do not exists, also insert sample data to the tables
 */
sequelize.sync().then(async ()=>{
  
  const umzug = new Umzug({
    migrations: { glob: 'migrations/*.js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });
  
  await umzug.up();

})


module.exports = db;