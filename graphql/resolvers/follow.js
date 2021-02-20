const Follow = require("../../models/follow");
const User = require("../../models/user");
const { transformFollow } = require("./merge");

module.exports = {
  createFollowing: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const followUser = await User.findOne({
      _id: args.followInput.followed_userId
    });
    if (!followUser) {
      throw new Error("Following user not found");
    }

    const follow = new Follow({
      userId: req.userId,
      following_userId: followUser._id
    });
    let following;
    try {
      await follow.save();
      following = transformFollow(follow);

      const currentUser = await User.findById(req.userId);
      console.log("currentUser", currentUser);
      if (!currentUser) {
        throw new Error("Current user not found");
      }
      currentUser.following.push(follow.following_userId);
      await currentUser.save();

      const followingUser = await User.findById(followUser._id);
      if (!followingUser) {
        throw new Error("Following user not found");
      }
      followingUser.follower.push(follow.userId);
      await followingUser.save();

      return following;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  cancelFollowing: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const unfollower = await Follow.findOne({
        $and: [
          { userId: args.unfollowInput.current_userId },
          { following_userId: args.unfollowInput.unfollowed_userId }
        ]
      });
      if (!unfollower) {
        throw new Error("Unfollower not found.");
      }

      const currentUser = await User.findById(unfollower.userId);
      if (!currentUser) {
        throw new Error("Current user not found");
      }
      currentUser.following.pull({ _id: args.unfollowInput.unfollowed_userId });
      await currentUser.save();

      const unfollowedUser = await User.findById(unfollower.following_userId);
      if (!unfollowedUser) {
        throw new Error("Unfollowed user not found");
      }
      unfollowedUser.follower.pull({ _id: args.unfollowInput.current_userId });
      await unfollowedUser.save();

      await Follow.deleteOne({ _id: unfollower._id });
      return unfollowedUser;
    } catch (err) {
      throw err;
    }
  }
};
