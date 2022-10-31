module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.FLOAT,
      },
      email: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        field: "created_date_time",
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: "updated_date_time",
        type: Sequelize.DATE,
      },
    });
    return Users;
  };  