const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

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
        return medias;
      },
      createMedia: (args) => {
        const media = {
          _id: Math.random().toString(),
          media_url: args.mediaInput.media_url,
          media_caption: args.mediaInput.media_caption,
          date: new Date().getTime()
        };
        medias.push(media);
        return media;
      }
    },
    graphiql: true
  })
);

app.listen(3000);
