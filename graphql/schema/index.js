const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Follow {
  _id: ID!
  following: User!
  followed: User!
}

type Comment {
  _id: ID!
  media: Media!
  creator: User!
  media_comment: String!
  date: String!
}

type Saved {
  _id: ID!
  media: Media!
  user:  User!
}

type Liked {
  _id: ID!
  media: Media!
  user: User!
}

type Media {
  _id: ID!
  media_url: String!
  media_caption: String!
  date: String!
  creator: User!
  commentTexts: [Comment!]
  likeds: [Liked!]
}

type User {
  _id: ID!
  email: String!
  username: String!
  full_name: String!
  password: String!
  profile_pic_url: String!
  createdMedias: [Media!]
  following: [User!]
  follower: [User!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
  userName: String!
}

input MediaInput {
  media_url: String!
  media_caption: String!
}

input UserInput {
  email: String!
  username: String!
  full_name: String!
  password: String!
  profile_pic_url: String
}

input CommentInput {
  mediaId: ID!
  media_comment: String!
}

input FollowInput {
  current_userId: ID!
  followed_userId: ID!
}

input UnfollowInput {
  current_userId: ID!
  unfollowed_userId: ID!
}

type RootQuery {
  medias: [Media!]!
  media(mediaId: String!): Media!
  likeds: [Liked!]!
  saveds: [Saved!]!
  comments: [Comment!]
  followings: [User!]!
  followers: [User!]
  login(email: String!, password: String!): AuthData!
  isLike(mediaId: String!, userId: String!): Liked
  isSave(mediaId: String!, userId: String!): Saved
  userData(username: String!): User
  isFollowing(currentUserId: ID!, otherUserId: ID!): Follow
  isFollowed(currentUserId: ID!, otherUserId: ID!): Follow
}

type RootMutation {
  createMedia(mediaInput: MediaInput): Media
  deleteMedia(mediaId: ID!): User
  createUser(userInput: UserInput): User
  likedMedia(mediaId: ID!): Liked!
  cancelLiked(likedId: ID!): Media!
  savedMedia(mediaId: ID!): Saved!
  cancelSaved(savedId: ID!): Media!
  createComment(commentInput: CommentInput): Comment!
  deleteComment(commentId: ID!): Media!
  createFollowing(followInput: FollowInput): Follow!
  cancelFollowing(unfollowInput: UnfollowInput): User
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
