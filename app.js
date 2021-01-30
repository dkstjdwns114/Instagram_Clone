const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Media = require("./models/media");

const app = express();

const medias = [];

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
      type Media {
        _id: ID!
        media_url: String!
        media_caption: String!
        date: String!
      }

      input MediaInput {
        media_url: String!
        media_caption: String!
      }

      type RootQuery {
        medias: [Media!]!
      }

      type RootMutation {
        createMedia(mediaInput: MediaInput): Media
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      medias: () => {
        return Media.find()
          .then((medias) => {
            return medias.map((media) => {
              return { ...media._doc, _id: media.id };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createMedia: (args) => {
        const media = new Media({
          media_url: args.mediaInput.media_url,
          media_caption: args.mediaInput.media_caption,
          date: +new Date().getTime()
        });
        return media
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      }
    },
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.6v20o.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
