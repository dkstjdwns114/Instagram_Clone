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
  likedMedia: async (args) => {
    const fetchedMedia = await Media.findOne({ _id: args.mediaId });
    const liked = new Liked({
      user: "60164665ea5d512a88a0a295",
      media: fetchedMedia
    });
    await liked.save();
    return transformLikedAndSaved(liked);
  },
  cancelLiked: async (args) => {
    try {
      const liked = await Liked.findById(args.likedId).populate("media");
      const media = {
        ...liked.media._doc,
        _id: liked.media.id,
        creator: User.bind(this, liked.media._doc.creator)
      };
      await Liked.deleteOne({ _id: args.likedId });
      return media;
    } catch (err) {
      throw err;
    }
  }
};
