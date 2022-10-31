module.exports = (sequelize, Sequelize) => {
    const Employees = sequelize.define('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      emp_id: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      salary: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING,
      },
      department: {
        type: Sequelize.STRING,
      },
      sub_department: {
        type: Sequelize.STRING,
      },
      on_contract: {
        type: Sequelize.STRING,
      },
      createdAt: {
        field: 'created_date_time',
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: 'updated_date_time',
        type: Sequelize.DATE,
      },
    });
    return Employees;
  };
