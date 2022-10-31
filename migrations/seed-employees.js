'use strict';

module.exports = {
    //Inserting employees initial data
  up: async ({context:queryInterface}, Sequelize) => {
     await queryInterface.bulkInsert('Employees', [
      {name:"Abhishek", emp_id:"preloaded1", salary:145000, currency:"USD", department:"Engineering", sub_department:"Platform", on_contract:"false", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name:"Anurag", emp_id:"preloaded2", salary:90000, currency:"USD", department:"Banking", sub_department:"Loan", on_contract: "true", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name:"Himani", emp_id:"preloaded3", salary: 240000, currency: "USD", department: "Engineering", sub_department: "Platform", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name: "Yatendra", emp_id:"preloaded4", salary: 30, currency: "USD", department: "Operations", sub_department: "CustomerOnboarding", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name: "Ragini", emp_id:"preloaded5", salary: 30, currency: "USD", department: "Engineering", sub_department: "Platform", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name: "Nikhil", emp_id:"preloaded6", salary: 110000, currency: "USD", on_contract: "true", department: "Engineering", sub_department: "Platform", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name: "Guljit", emp_id:"preloaded7", salary: 30, currency: "USD", department: "Administration", sub_department: "Agriculture", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name: "Himanshu", emp_id:"preloaded8", salary: 70000, currency: "EUR", department: "Operations", sub_department: "CustomerOnboarding", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" },
      { name: "Anupam", emp_id:"preloaded9", salary: 200000000, currency: "INR", department: "Engineering", sub_department: "Platform", created_date_time:"2022-10-31T09:40:12.000Z", updated_date_time:"2022-10-31T09:40:12.000Z" }
  ], {});
  }
};