const Follow = require("../../models/follow");
const User = require("../../models/user");
const { transformFollow } = require("./merge");

module.exports = {
  isFollowing: async (args, req) => {
    try {
      const following = await Follow.findOne({
        $and: [
          { following: args.currentUserId },
          { followed: args.otherUserId }
        ]
      });
      return following;
    } catch (err) {
      throw new Error(err);
    }
  },
  isFollowed: async (args, req) => {
    try {
      const followed = await Follow.findOne({
        $and: [
          { following: args.otherUserId },
          { followed: args.currentUserId }
        ]
      });
      return followed;
    } catch (err) {
      throw new Error(err);
    }
  },
  createFollowing: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const followedUser = await User.findOne({
      _id: args.followed_userId
    });
    if (!followedUser) {
      throw new Error("Following user not found");
    }

    const follow = new Follow({
      following: req.userId,
      followed: followedUser._id
    });
    let returnFollowing;
    try {
      await follow.save();
      returnFollowing = transformFollow(follow);

      const currentUser = await User.findById(req.userId);
      if (!currentUser) {
        throw new Error("Current user not found");
      }
      currentUser.following.push(follow.followed);
      await currentUser.save();

      const followingUser = await User.findById(followedUser._id);
      if (!followingUser) {
        throw new Error("Following user not found");
      }
      followingUser.follower.push(follow.following);
      await followingUser.save();

      return returnFollowing;
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
        $and: [{ following: req.userId }, { followed: args.unfollowed_userId }]
      });
      if (!unfollower) {
        throw new Error("Unfollower not found.");
      }

      const currentUser = await User.findById(unfollower.following);
      if (!currentUser) {
        throw new Error("Current user not found");
      }
      currentUser.following.pull({ _id: args.unfollowed_userId });
      await currentUser.save();

      const unfollowedUser = await User.findById(unfollower.followed);
      if (!unfollowedUser) {
        throw new Error("Unfollowed user not found");
      }
      unfollowedUser.follower.pull({ _id: req.userId });
      await unfollowedUser.save();

      await Follow.deleteOne({ _id: unfollower._id });
      return unfollowedUser;
    } catch (err) {
      throw err;
    }
  }
};
