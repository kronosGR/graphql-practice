require('dotenv').config();
const db = require('./models');
db.sequelize.sync({ force: false });

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const GraphQL = require('graphql');

const studentType = require('./types/studentType')(GraphQL);
const StudentService = require('./services/studentService');
const schoolType = require('./types/schoolType');
const SchoolService = require('./services/SchoolService');
const studentService = new StudentService(db);

const RootQuery = new GraphQL.GraphQLObjectType({
  name: 'Query',
  fields: {
    getStudent: {
      type: studentType,
      args: { id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID) } },
    },
    getStudents: {
      type: GraphQL.GraphQLList(studentType),
    },
    getSchool: {
      type: schoolType,
      args: { id: { type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID) } },
    },
    getSchools: {
      type: GraphQL.GraphQLList(schoolType),
    },
  },
});

const Mutation = new GraphQL.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createStudent: {
      type: studentType,
      args: {
        FirstName: { type: GraphQL.GraphQLString },
        LastName: { type: GraphQL.GraphQLString },
        SchoolId: { type: GraphQL.GraphQLID },
      },
    },
    createSchool: {
      type: schoolType,
      args: {
        Name: { type: GraphQL.GraphQLString },
        Address: { type: GraphQL.GraphQLString },
        Description: { type: GraphQL.GraphQLString },
      },
    },
    deleteStudent: {
      type: studentType,
      args: {
        id: { type: GraphQL.GraphQLID },
      },
    },
    deleteSchool: {
      type: schoolType,
      args: {
        id: { type: GraphQL.GraphQLID },
      },
    },
  },
});

const schema = new GraphQL.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const root = {
  getStudent: async ({ id }) => await studentService.get(id),
  getStudents: async () => await studentService.getAll(),
  createStudent: async ({ FirstName, LastName, SchoolId }) =>
    await studentService.create(FirstName, LastName, SchoolId),
  deleteStudent: async ({ id }) => await studentService.delete(id),
  getSchool: async ({ id }) => await SchoolService.get(id),
  getSchools: async () => await SchoolService.getAll(),
  createSchool: async ({ Name, Address, Description }) =>
    await SchoolService.create(Name, Address, Description),
  deleteSchool: async ({ id }) => await SchoolService.delete(id),
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(process.env.PORT);
console.log('Running a GraphQL API server at http://localhost:3000/graphql');
