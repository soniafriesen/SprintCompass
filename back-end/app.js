const { port, graphql } = require("./config");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const { resolvers } = require("./resolvers");
const { schema } = require("./schema");
const cors = require("cors");
app.use(cors());
app.use(
  graphql,
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);
app.listen(port);
console.log(`Server ready on locahost:${port}${graphql}`);
