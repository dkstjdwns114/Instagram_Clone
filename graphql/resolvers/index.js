const authResolver = require("./auth");
const mediasResolver = require("./medias");
const commentsResolver = require("./comments");
const likesResolver = require("./likes");
const saveResolver = require("./save");
const profileResolver = require("./profile");

const rootResolver = {
  ...authResolver,
  ...mediasResolver,
  ...commentsResolver,
  ...likesResolver,
  ...saveResolver,
  ...profileResolver
};

module.exports = rootResolver;
