const Media = require("../../models/media");
const Liked = require("../../models/liked");
const { transformLikedAndSaved } = require("./merge");
const user = require("../../models/user");

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
      user: "601566f405fd7104d4b911f4",
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
        creator: user.bind(this, liked.media._doc.creator)
      };
      await Liked.deleteOne({ _id: args.likedId });
      return media;
    } catch (err) {
      throw err;
    }
  }
};
