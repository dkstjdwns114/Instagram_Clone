const authResolver = require("./auth");
const mediasResolver = require("./medias");
const commentsResolver = require("./comments");
const likesResolver = require("./likes");
const saveResolver = require("./save");

const rootResolver = {
  ...authResolver,
  ...mediasResolver,
  ...commentsResolver,
  ...likesResolver,
  ...saveResolver
};

module.exports = rootResolver;
