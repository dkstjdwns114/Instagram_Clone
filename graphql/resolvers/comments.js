const Media = require("../../models/media");
const Commented = require("../../models/comment");
const User = require("../../models/user");
const { singleMedia, transformComment } = require("./merge");

module.exports = {
  comments: async () => {
    try {
      const comments = await Commented.find();
      return comments.map((comments) => {
        return {
          ...comments._doc,
          _id: comments.id,
          creator: User.bind(this, comments._doc.creator),
          media: singleMedia.bind(this, comments._doc.media)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  createComment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const fetchedMedia = await Media.findOne({
      _id: args.commentInput.mediaId
    });
    const commented = new Commented({
      creator: req.userId,
      // creator: "6017c04392f52159c47c2ea5",
      media_comment: args.commentInput.media_comment,
      date: +new Date().getTime(),
      media: fetchedMedia
    });
    let createdComment;
    try {
      const result = await commented.save();
      createdComment = transformComment(result);
      const medias = await Media.findById(args.commentInput.mediaId);
      if (!medias) {
        throw new Error("Post not found.");
      }
      medias.commentTexts.push(commented);
      await medias.save();
      return createdComment;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  deleteComment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const commented = await Commented.findById(args.commentId).populate(
        "media"
      );

      const media = {
        ...commented.media._doc,
        _id: commented.media.id,
        creator: User.bind(this, commented.media._doc.creator)
      };

      const commentMedia = await Media.findById(media._id);
      await Commented.deleteOne({ _id: args.commentId });
      await commentMedia.commentTexts.pull({ _id: args.commentId });
      await commentMedia.save();
      return media;
    } catch (err) {
      throw err;
    }
  }
};
