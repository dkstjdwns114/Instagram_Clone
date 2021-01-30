const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Media {
  _id: ID!
  media_url: String!
  media_caption: String!
  date: String!
  creator: User!
}

type User {
  _id: ID!
  email: String!
  username: String!
  password: String!
  profile_pic_url: String!
  createdMedias: [Media!]
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
`);
