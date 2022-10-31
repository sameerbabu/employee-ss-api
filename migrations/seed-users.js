'use strict';
//Inserting users initial data - sameer/sameer
module.exports = {
  up: async ({context:queryInterface}, Sequelize) => {
     await queryInterface.bulkInsert('Users', [
      {id:"1", user_id:"043352f9-718e-4423-b7c6-51caada9924f", username:"sameer", password:"$2a$08$i5jBCoixKo6lzFxqzib3seprTqs/LguITuecSfMu3OtlQnX24faiS", email:"dummymail@testxyz.xom", role:"1", status:"1", created_date_time:"2022-10-31T09:10:38.000Z", updated_date_time:"2022-10-31T09:10:38.000Z" }
  ], {});
  }
};