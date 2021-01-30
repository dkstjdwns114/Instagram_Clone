const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Saved {
  _id: ID!
  media: Media!
  user:  User!
}

type Liked {
  _id: ID!
  media: Media!
  user:  User!
}

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
  likeds: [Liked!]!
}

type RootMutation {
  createMedia(mediaInput: MediaInput): Media
  createUser(userInput: UserInput): User
  likedMedia(mediaId: ID!): Liked!
  cancelLiked(likedId: ID!): Media!
  savedMedia(mediaId: ID!): Saved!
  cancelSaved(savedId: ID!): Media!
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
