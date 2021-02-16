const Media = require("../../models/media");
const Saved = require("../../models/saved");
const { transformMedia, transformLikedAndSaved } = require("./merge");
const user = require("../../models/user");

module.exports = {
  saveds: async () => {
    try {
      const saveds = await Saved.find();
      return saveds.map((saveds) => {
        return transformMedia(saveds);
      });
    } catch (err) {
      throw err;
    }
  },
  isSave: async (args, req) => {
    try {
      const saved = await Saved.findOne({
        $and: [{ media: args.mediaId }, { user: args.userId }]
      });
      return true;
    } catch (err) {
      return false;
    }
  },
  savedMedia: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    const fetchedMedia = await Media.findOne({ _id: args.mediaId });
    const saved = new Saved({
      // user: req.userId,
      user: "6017c04392f52159c47c2ea5",
      media: fetchedMedia
    });
    const result = await saved.save();
    return transformLikedAndSaved(result);
  },
  cancelSaved: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const saved = await Saved.findById(args.savedId).populate("media");
      const media = {
        ...saved.media._doc,
        _id: saved.media.id,
        creator: user.bind(this, saved.media._doc.creator)
      };
      await Saved.deleteOne({ _id: args.savedId });
      return media;
    } catch (err) {
      throw err;
    }
  }
};
