const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const path = require("path");
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");
var cors = require("cors");

const app = express();

app.use(bodyParser.json());

const whitelist = [
  "http://localhost:3000",
  "http://localhost:8000",
  "https://anstagram.herokuapp.com"
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable");
      callback(null, true);
    } else {
      console.log("Origin rejected");
      callback(new Error("Not allowed By CORS"));
    }
  }
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
  });
}

mongoose.set("useFindAndModify", false);

mongoose
  .connect(
    `mongodb+srv://test1:KQ2DmS5BaPpKIBxL@cluster0.6v20o.mongodb.net/instagram-clone?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, (req, res) => {
      console.log(`server listning on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
