
# Summary statistics Micro-service

A micro-service which is useful to derive simplified summary statistics (mean, min, max) on a dataset.



## Stack
API - Node JS \
DB - SQLite



## Steps to run/test the service

Download and extract the zip file

### 1. To Run the service
Inside the `root directory` run the following command
```
docker-compose up
```
This runs the service on port **`5051`**

### 2. To Test the service
Inside the `root directory`  run the following command
```
docker-compose run api-server npm run test
```
This will log the number of test cases pass/fail in the `console`.



## API Reference

Assuming this will be running in local, the API base url will be \
`http://localhost:5051`

If you have deployed this in some other sample server use the server public DNS instead of localhost

## #1. Login to generate JWT (token)

```
  POST /api/v1/user/signin
```
On successful signin returns **token** in the response. This token should be used in all the other APIs as `x-access-token` request header

| RAW Body JSON | Type     | Description                | Value      |
| :-------- | :------- | :------------------------- | :-------  |
| `username` | `string` | **Required**            |sameer     |
| `password` | `string` | **Required**             |sameer     |

| Header | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `Content-Type`      | `string` | **Required**. application/json |


#### CURL request
```
curl --location --request POST 'http://localhost:5051/api/v1/user/signin' \
--header 'Content-Type: application/json' \
--data-raw '{"username":"sameer", "password":"sameer"}'
```

## #2. Get list of employees

```http
  GET /api/v1/employees
```
Get the list of all employees, no query parameter filters are honoured. 

| Header | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `x-access-token`      | `string` | **Required**. token got from user/signin API |

#### Sample CURL request
```
curl --location --request GET 'http://localhost:5051/api/v1/employees' \
--header 'x-access-token: abc.pqr.xyz' \
```


## #3. Add employee

```
  POST /api/v1/employees
```
Add employee to the dataset and return the `emp_id` along with the other details.

| RAW Body JSON | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**            |
| `salary` | `string` | **Required**             |
| `currency` | `string` | **Required**             |
| `department` | `string` | **Required**             |
| `sub_department` | `string` | **Required**             |
| `on_contract` | `string` | **Optional** Default Value: false (Accepts values from [ true, false ])|

| Header | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `x-access-token`      | `string` | **Required**. token got from user/signin API |
| `Content-Type`      | `string` | **Required**. application/json |

#### Sample CURL request
```http
curl --location --request POST 'http://localhost:5051/api/v1/employees' \
--header 'x-access-token: abc.pqr.xyz' \
--header 'Content-Type: application/json' \
--data-raw '{"name":"Adams", "salary":"1000", "currency":"USD",  "department":"Administration", "sub_department":"Agriculture", "on_contract":"true"}'
```


## #4. Delete employee

```http
  DELETE /api/v1/employees
```
Delete employee from the dataset using the `emp_id` in query parameter.

| Query Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `emp_id` | `string` | **Required** emp_id we get on adding an employee, list of employees           |

| Header | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `x-access-token`      | `string` | **Required**. token got from user/signin API |
| `Content-Type`      | `string` | **Required**. application/json |

#### Sample CURL request
```http
curl --location --request DELETE 'http://localhost:5051/api/v1/employees?emp_id=preloaded9' \
--header 'x-access-token: abc.pqr.xyz'
```

## #5. Get SS for salary of employees

```http
  GET /api/v1/employees/ss
```
Get SS for salary of employee from the dataset based on the query parameter. \
- If no query parameter is provided - **Returns SS for all employees** \
- If group_by, on_contract query parameter is provided - **Returns SS for mentioned parameter**\
- Combination of group_by, on_contract query parameters is allowed

    

| Query Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `group_by` | `string` | **Optional**  Accepts values from [ department, sub_department ]|
| `on_contract` | `string` | **Optional**  Accepts values from [ true, false ]|

| Header | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `x-access-token`      | `string` | **Required**. token got from user/signin API |
| `Content-Type`      | `string` | **Required**. application/json |

#### Sample CURL request for SS of salary of all employees
```http
curl --location --request GET 'http://localhost:5051/api/v1/employees/ss' \
--header 'x-access-token: abc.pqr.xyz'
```

#### Sample CURL request for SS of salary for each department
```http
curl --location --request GET 'http://localhost:5051/api/v1/employees/ss?group_by=department' \
--header 'x-access-token: abc.pqr.xyz'
```

#### Sample CURL request for SS of salary for each sub_department
```http
curl --location --request GET 'http://localhost:5051/api/v1/employees/ss?group_by=sub_department' \
--header 'x-access-token: abc.pqr.xyz'
```

#### Sample CURL request for SS of salary of employees who satisfy on_contract=true
```http
curl --location --request GET 'http://localhost:5051/api/v1/employees/ss?on_contract=true' \
--header 'x-access-token: abc.pqr.xyz'
```

#### Sample CURL request for SS of salary of employees who satisfy on_contract=false
```http
curl --location --request GET 'http://localhost:5051/api/v1/employees/ss?on_contract=false' \
--header 'x-access-token: abc.pqr.xyz'
```

#### Sample CURL request for SS of salary of employees who satisfy on_contract=false for each sub_department
```http
curl --location --request GET 'http://localhost:5051/api/v1/employees/ss?group_by=sub_department&on_contract=false' \
--header 'x-access-token: abc.pqr.xyz'
```

## Have a question

I'm just an email away! You can reach me at sameerbabu.shaik@gmail.com
