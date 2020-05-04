const express = require("express");
const expressGraphQL = require("express-graphql");
const { graphqlUploadExpress } = require("graphql-upload");
const path = require("path");
const schema = require("./schema");

const app = express();

app.use(express.static("./"));

/*
- https://github.com/graphql/express-graphql
  Mounting express-graphql as a route handler:
*/
app.use(
  "/graphql",
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }), //https://github.com/jaydenseric/graphql-upload
  expressGraphQL({
    schema,
    graphiql: true //gives us user interface to access our graphql server without having to manually call it through postman etc.
  })
);

/*
 * Any url that's not /graphql will get redirected where
 */
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./", "index.html"));
});

app.listen(5000, () => {
  console.log("🚀 Server started at PORT 5000");
});
