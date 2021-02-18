const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const { cloudinary } = require("./utils/cloudinary");

const app = express();

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const isAuth = require("./middleware/is-auth");

let secure_url;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/api/image", async (req, res) => {
  res.send({ url: secure_url });
});

app.use(bodyParser.json());

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

app.post("/api/upload", async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "anstagram"
    });
    console.log(uploadedResponse);

    secure_url = uploadedResponse.secure_url;

    res.json({ msg: "Successed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Something went wrong" });
  }
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6v20o.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
