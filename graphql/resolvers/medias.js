const Media = require("../../models/media");
const User = require("../../models/user");
const { transformMedia } = require("./merge");

module.exports = {
  medias: async () => {
    try {
      const medias = await Media.find();
      return medias.map((media) => {
        return transformMedia(media);
      });
    } catch (err) {
      throw err;
    }
  },
  createMedia: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const media = new Media({
      media_url: args.mediaInput.media_url,
      media_caption: args.mediaInput.media_caption,
      date: +new Date().getTime(),
      creator: req.userId
    });
    let createdMedia;
    try {
      const result = await media.save();
      createdMedia = transformMedia(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdMedias.push(media);
      await creator.save();
      return createdMedia;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  deleteMedia: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const media = await Media.findById(args.mediaId);
      if (!media) {
        throw new Error("Media not found.");
      }
      const user = {
        ...media.creator._doc,
        _id: media.creator._id
      };
      await Media.deleteOne({ _id: args.mediaId });
      return user;
    } catch (err) {
      throw err;
    }
  }
};
