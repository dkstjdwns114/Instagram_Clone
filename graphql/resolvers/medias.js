const Media = require("../../models/media");
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
  createMedia: async (args) => {
    const media = new Media({
      media_url: args.mediaInput.media_url,
      media_caption: args.mediaInput.media_caption,
      date: +new Date().getTime(),
      creator: "601566f405fd7104d4b911f4"
    });
    let createdMedia;
    try {
      const result = await media.save();
      createdMedia = transformMedia(result);
      const creator = await User.findById("601566f405fd7104d4b911f4");
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
  }
};
