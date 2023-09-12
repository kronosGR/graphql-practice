const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
require('dotenv').config();

const db = require('./models');
db.sequelize.sync({ force: false });

const schema = buildSchema(`
type Query {
  hello: String
}
`);

var root = {
  hello: () => {
    return 'Hello world!';
  },
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

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
