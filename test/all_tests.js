//During the test the env variable is set to test
process.env.NODE_ENV = "test";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server.js");
let should = chai.should();
let expect = chai.expect;
var token = "";
var new_emp_id = "";
var emp_count = 0;

chai.use(chaiHttp);

//User Login block
describe("User", () => {
  describe("/POST /api/v1/user/signin", () => {
    it("it should Login using sameer/sameer", (done) => {
      chai
        .request(server)
        .post("/api/v1/user/signin")
        .send({
          username: "sameer",
          password: "sameer",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.have.property("token");
          token = res.body.data.token;
          done();
        });
    })
    it("it shouldn't be able to Login using sameer1/sameer && status = 401 ", (done) => {
      chai
        .request(server)
        .post("/api/v1/user/signin")
        .send({
          username: "sameer1",
          password: "sameer",
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.have.property("data");
          done();
        });
    })
    
    it("it shouldn't be able to Login using sameer/sameer1 && status = 401 ", (done) => {
      chai
        .request(server)
        .post("/api/v1/user/signin")
        .send({
          username: "sameer",
          password: "sameer1",
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.not.have.property("body");
          done();
        });
    })
  })
  
  
  

})

//Employee API Block
describe("Employees", () => {
  beforeEach((done) => {
    
    //login to get access token, if we dont have any token
    if(token == ""){
      chai
      .request(server)
      .post("/api/v1/user/signin")
      .send({
        username: "sameer",
        password: "sameer",
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.have.property("token");
        token = res.body.data.token;
        done();
      });
       
    }
    else{
      done();
    }
     
  });

  /*
   * Test /GET Employees route
   */
  describe("/GET /api/v1/employees", () => {
    it("it shouldn't be able to GET employees data with malformed x-access-token header && status=401", (done) => {
      chai
        .request(server)
        .get("/api/v1/employees")
        .set("x-access-token", "abc"+token+"abc")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it("it shouldn't be able to GET employees data with no x-access-token && status=401", (done) => {
      chai
        .request(server)
        .get("/api/v1/employees")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it("it should GET all the employees with status 200 && data as array", (done) => {
      chai
        .request(server)
        .get("/api/v1/employees")
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          emp_count = res.body.data.length;
          done();
        });
    });

  });
  
  
  /*
   * Test /POST Employees route
   */
  describe("/POST /api/v1/employees", () => {
    it("it should POST a new employee with status 200 and get employee details as object", (done) => {
      let employee = {
        name: "testuser-1",
        salary: 10000,
        currency: "USD",
        department: "Software",
        sub_department: "QA",
      };
      chai
        .request(server)
        .post("/api/v1/employees")
        .set("x-access-token", token)
        .send(employee)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.an("object");
          res.body.data.emp_id.should.be.a("string");
          new_emp_id = res.body.data["emp_id"];
          done();
        });
    });
  });

  /*
   * Test /DELETE Employees route
   */
  describe(`/DELETE /api/v1/employees`, () => {
    it(`it should DELETE the recently added employee && status 200`, (done) => {
      chai
        .request(server)
        .delete(`/api/v1/employees?emp_id=${new_emp_id}`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
    
    it(`it shouldn't be able to DELETE non existing employee && status 400`, (done) => {
      chai
        .request(server)
        .delete(`/api/v1/employees?emp_id=${new_emp_id}`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors.should.be.an("object");
          done();
        });
    });

  });

  
  /*
   * Test the SS: For all employees /GET route
   */
  describe("/GET /api/v1/employees/ss", () => {
    it("it should GET SS for employee salary : For all employees with status 200 && check response for Mean/Min/Max if applicable", (done) => {
      chai
        .request(server)
        .get(`/api/v1/employees/ss`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          
          if(emp_count > 0){
            res.body.data.length.should.not.be.eql(0);
            res.body.data.map((obj)=>{
              obj.should.be.an("object");
              obj.should.all.have.all.keys('mean', 'min', 'max');
            })
          }
          
          done();
        });
    });
  });
  
  /*
   * Test the SS: Group by department /GET route
   */
  describe("/GET /api/v1/employees/ss?group_by=department", () => {
    it("it should GET SS for employee salary : group by department with status 200 && check response for Department/SS if applicable", (done) => {
      chai
        .request(server)
        .get(`/api/v1/employees/ss?group_by=department`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          
          if(emp_count > 0){
            res.body.data.length.should.not.be.eql(0);
            res.body.data.map((obj)=>{
              obj.should.be.an("object");
              obj.should.all.have.all.keys('department', 'mean', 'min', 'max');
            })
          }
          
          done();
        });
    });
  });
  
  /*
   * Test the SS: Group by sub_department /GET route
   */
  describe("/GET /api/v1/employees/ss?group_by=sub_department", () => {
    it("it should GET SS for employee salary : group by sub_department with status 200 && check response for Department/Sub_department/SS if applicable", (done) => {
      chai
        .request(server)
        .get(`/api/v1/employees/ss?group_by=sub_department`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          
          if(emp_count > 0){
            res.body.data.length.should.not.be.eql(0);
            res.body.data.map((obj)=>{
              obj.should.be.an("object");
              obj.should.all.have.all.keys('department', 'sub_department', 'mean', 'min', 'max');
            })
          }
          
          done();
        });
    });
  });
  
  /*
   * Test the SS: Filter By on_contract=false /GET route
   */
  describe("/GET /api/v1/employees/ss?on_contract=false", () => {
    it("it should GET SS for employee salary : filter by on_contract=false with status 200 && && check response for SS if applicable", (done) => {
      chai
        .request(server)
        .get(`/api/v1/employees/ss?on_contract=false`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          
          if(emp_count > 0){
            res.body.data.length.should.not.be.eql(0);
            res.body.data.map((obj)=>{
              obj.should.be.an("object");
              obj.should.all.have.all.keys('mean', 'min', 'max');
            })
          }
          
          done();
        });
    });
  });
  
  /*
   * Test the SS: Filter By on_contract=true /GET route
   */
  describe("/GET /api/v1/employees/ss?on_contract=true", () => {
    it("it should GET SS for employee salary : filter by on_contract=true with status 200 && check response for SS if applicable", (done) => {
      chai
        .request(server)
        .get(`/api/v1/employees/ss?on_contract=true`)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("array");
          
          if(emp_count > 0){
            res.body.data.length.should.not.be.eql(0);
            res.body.data.map((obj)=>{
              obj.should.be.an("object");
              obj.should.all.have.all.keys('mean', 'min', 'max');
            })
          }
          
          done();
        });
    });
  });



});