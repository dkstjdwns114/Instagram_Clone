const DataLoader = require("dataloader");

const Media = require("../../models/media");
const User = require("../../models/user");
const Follow = require("../../models/follow");
const Comment = require("../../models/comment");
const Like = require("../../models/liked");
const Save = require("../../models/saved");

const { transformMedia } = require("./merge");

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const mediaLoader = new DataLoader((mediaIds) => {
  return medias(mediaIds);
});

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdMedias: () => mediaLoader.loadMany(user._doc.createdMedias)
    };
  } catch (err) {
    throw err;
  }
};

const comment = async (mediaId) => {
  try {
    const comments = await Comment.find({ media: mediaId });
    const retComment = comments.map((comment) => {
      return {
        ...comment._doc,
        _id: comment.id,
        media_comment: comment.media_comment,
        date: comment.date,
        creator: user.bind(this, comment.creator)
      };
    });
    return retComment;
  } catch (err) {
    throw err;
  }
};

const likese = async (mediaId) => {
  try {
    const likese = await Like.find({ media: mediaId });
    const retLike = likese.map((like) => {
      return {
        ...like._doc,
        _id: like.id,
        user: user.bind(this, like.user),
        media: like.media
      };
    });
    return retLike;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  timelineMedia: async (args, req) => {
    try {
      const following = await Follow.find({ following: req.userId });
      let followingUserIds = following.map((followingUserId) => {
        return followingUserId.followed;
      });
      followingUserIds.push(req.userId);
      const medias = await Media.find({ creator: { $in: followingUserIds } });

      return medias.map((media) => {
        return {
          ...media._doc,
          _id: media.id,
          creator: user.bind(this, media.creator),
          commentTexts: comment.bind(this, media),
          likeds: likese.bind(this, media)
        };
      });
    } catch (err) {
      throw err;
    }
  },
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
  media: async (args, req) => {
    try {
      const media = await Media.findById(args.mediaId);
      if (!media) {
        throw new Error("Media not found.");
      }
      return transformMedia(media);
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

      const deleteCreatedMedia = await User.findById(user._id);

      deleteCreatedMedia.createdMedias.pull({ _id: args.mediaId });
      await deleteCreatedMedia.save();

      await Save.deleteMany({ media: args.mediaId });
      await Like.deleteMany({ media: args.mediaId });
      await Comment.deleteMany({ media: args.mediaId });

      await Media.deleteOne({ _id: args.mediaId });

      return user;
    } catch (err) {
      throw err;
    }
  },
  updateMedia: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const media = await Media.findOneAndUpdate(
        { _id: args.mediaId },
        {
          $set: {
            media_caption: args.media_caption
          }
        },
        { new: true, useFindAndModify: false }
      );

      return media;
    } catch (err) {
      throw err;
    }
  }
};
