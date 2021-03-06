const Media = require("../../models/media");
const Liked = require("../../models/liked");
const User = require("../../models/user");
const { transformLikedAndSaved } = require("./merge");

module.exports = {
  likeds: async () => {
    try {
      const likeds = await Liked.find();
      return likeds.map((liked) => {
        return transformLikedAndSaved(liked);
      });
    } catch (err) {
      throw err;
    }
  },
  isLike: async (args, req) => {
    try {
      const liked = await Liked.findOne({
        $and: [{ media: args.mediaId }, { user: args.userId }]
      });
      return liked;
    } catch (err) {
      return new Error(false);
    }
  },
  likedMedia: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedMedia = await Media.findOne({ _id: args.mediaId });
    const liked = new Liked({
      user: req.userId,
      media: fetchedMedia
    });
    let likedMedia;
    try {
      await liked.save();
      likedMedia = transformLikedAndSaved(liked);
      const media = await Media.findById(args.mediaId);
      if (!media) {
        throw new Error("Post not found.");
      }
      media.likeds.push(liked);
      await media.save();
      return likedMedia;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  cancelLiked: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const liked = await Liked.findById(args.likedId).populate("media");
      const media = {
        ...liked.media._doc,
        _id: liked.media.id,
        creator: User.bind(this, liked.media._doc.creator)
      };
      const pullLikeMedia = await Media.findById(media._id);

      pullLikeMedia.likeds.pull({ _id: args.likedId });
      await pullLikeMedia.save();
      await Liked.deleteOne({ _id: args.likedId });

      return media;
    } catch (err) {
      throw err;
    }
  }
};
