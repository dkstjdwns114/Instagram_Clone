const DataLoader = require("dataloader");

const User = require("../../models/user");
const Media = require("../../models/media");
const { transformProfileData } = require("./merge");

const userNameLoader = new DataLoader((username) => {
  return User.find({ username: { $in: username } });
});

module.exports = {
  userData: async (args, req) => {
    try {
      const user = await userNameLoader.load(args.username);
      return transformProfileData(user);
    } catch (err) {
      throw err;
    }
  }
};
