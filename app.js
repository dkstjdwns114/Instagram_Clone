const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Media = require("./models/media");
const User = require("./models/user");

const app = express();

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

      type User {
        _id: ID!
        email: String!
        username: String!
        password: String!
        profile_pic_url: String!
      }

      input MediaInput {
        media_url: String!
        media_caption: String!
      }

      input UserInput {
        email: String!
        username: String!
        password: String!
        profile_pic_url: String
      }

      type RootQuery {
        medias: [Media!]!
      }

      type RootMutation {
        createMedia(mediaInput: MediaInput): Media
        createUser(userInput: UserInput): User
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
          date: +new Date().getTime(),
          creator: "601566f405fd7104d4b911f4"
        });
        let createdMedia;
        return media
          .save()
          .then((result) => {
            createdMedia = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById("601566f405fd7104d4b911f4");
          })
          .then((user) => {
            if (!user) {
              throw new Error("User not found.");
            }
            user.createdMedias.push(media);
            return user.save();
          })
          .then((result) => {
            return createdMedia;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({
          $or: [
            { email: args.userInput.email },
            { username: args.userInput.username }
          ]
        })
          .then((user) => {
            if (user) {
              throw new Error("Email or Username exists already");
            }
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email: args.userInput.email,
              username: args.userInput.username,
              password: hashedPassword,
              profile_pic_url: args.userInput.profile_pic_url
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null, _id: result.id };
          })
          .catch((err) => {
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
