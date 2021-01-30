const Media = require("../../models/media");
const Commented = require("../../models/comment");
const { singleMedia } = require("./merge");
const user = require("../../models/user");

module.exports = {
  comments: async () => {
    try {
      const comments = await Commented.find();
      return comments.map((comments) => {
        return {
          ...comments._doc,
          _id: comments.id,
          user: user.bind(this, comments._doc.user),
          media: singleMedia.bind(this, comments._doc.media)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createComment: async (args) => {
    const fetchedMedia = await Media.findOne({
      _id: args.commentInput.mediaId
    });
    const commented = new Commented({
      creator: "601566f405fd7104d4b911f4",
      media_comment: args.commentInput.media_comment,
      date: +new Date().getTime(),
      media: fetchedMedia
    });
    const result = await commented.save();
    return {
      ...result._doc,
      _id: result.id,
      creator: user.bind(this, result._doc.creator),
      media: singleMedia.bind(this, result._doc.media)
    };
  },
  deleteComment: async (args) => {
    try {
      const commented = await Commented.findById(args.commentId).populate(
        "media"
      );
      const media = {
        ...commented.media._doc,
        _id: commented.media.id,
        creator: user.bind(this, commented.media._doc.creator)
      };
      await Commented.deleteOne({ _id: args.commentId });
      return media;
    } catch (err) {
      throw err;
    }
  }
};
