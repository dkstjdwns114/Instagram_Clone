const DataLoader = require("dataloader");

const User = require("../../models/user");
const { transformProfileData, transformTimelineMyData } = require("./merge");

const userNameLoader = new DataLoader((username) => {
  return User.find({ username: { $in: username } });
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

module.exports = {
  userData: async (args, req) => {
    try {
      const user = await userNameLoader.load(args.username);
      return transformProfileData(user);
    } catch (err) {
      throw err;
    }
  },
  editProfileData: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const user = await userLoader.load(req.userId);
      return transformProfileData(user);
    } catch (err) {
      throw err;
    }
  },
  timelineMyData: async (args, req) => {
    try {
      const user = await userLoader.load(args.userId.toString());
      return user;
    } catch (err) {
      throw err;
    }
  }
};
