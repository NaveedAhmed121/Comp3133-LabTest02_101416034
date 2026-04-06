const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: Date
    updated_at: Date
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
    created_at: Date
    updated_at: Date
  }

  type MessageResponse {
    success: Boolean!
    message: String!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    usernameOrEmail: String!
    password: String!
  }

  input EmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: Date!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: Date
    department: String
    employee_photo: String
  }

  type Query {
    # 2) Login
    login(input: LoginInput!): User

    # 3) Get all employees
    getAllEmployees: [Employee!]!

    # 5) Search employee by eid
    searchEmployeeByEid(eid: ID!): Employee

    # 8) Search by designation or department
    searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee!]!
  }

  type Mutation {
    # 1) Signup
    signup(input: SignupInput!): User!

    # 4) Add employee
    addNewEmployee(input: EmployeeInput!): Employee!

    # 6) Update employee
    updateEmployeeByEid(eid: ID!, input: UpdateEmployeeInput!): Employee!

    # 7) Delete employee
    deleteEmployeeByEid(eid: ID!): MessageResponse!
  }
`;
