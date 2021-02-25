const DataLoader = require("dataloader");

const Media = require("../../models/media");
const User = require("../../models/user");
const Comment = require("../../models/comment");
const Like = require("../../models/liked");

const mediaLoader = new DataLoader((mediaIds) => {
  return medias(mediaIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({ _id: { $in: userIds } });
});

const medias = async (mediaIds) => {
  try {
    const medias = await Media.find({ _id: { $in: mediaIds } });
    /*
    medias.sort((a, b) => {
      return (
        mediaIds.indexOf(a._id.toString()) - mediaIds.indexOf(b._id.toString())
      );
    });
    */
    return medias.map((media) => {
      return {
        ...media._doc,
        _id: media.id,
        date: +new Date().getTime(),
        creator: user.bind(this, media.creator),
        commentTexts: comment.bind(this, media),
        likeds: likese.bind(this, media)
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleMedia = async (mediaId) => {
  try {
    const media = await mediaLoader.load(mediaId.toString());
    return media;
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdMedias: () => mediaLoader.loadMany(user._doc.createdMedias),
      following: () => mediaLoader.loadMany(user._doc.following),
      follower: () => mediaLoader.loadMany(user._doc.follower)
    };
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

const transformMedia = (media) => {
  return {
    ...media._doc,
    _id: media.id,
    date: media._doc.date,
    creator: user.bind(this, media.creator),
    commentTexts: comment.bind(this, media),
    likeds: likese.bind(this, media)
  };
};

const transformProfileData = async (user) => {
  const userFollowings = await userLoader.loadMany(user._doc.following);
  const userFollowers = await userLoader.loadMany(user._doc.follower);
  const userMedias = await mediaLoader.loadMany(user._doc.createdMedias);
  return {
    ...user._doc,
    _id: user.id,
    following: () => userLoader.loadMany(user._doc.following),
    follower: () => userLoader.loadMany(user._doc.follower),
    username: user.username,
    profile_pic_url: user.profile_pic_url,
    createdMedias: () => mediaLoader.loadMany(user._doc.createdMedias)
  };
};

const transformTimelineMyData = (user) => {
  return {
    ...user._doc,
    _id: user.id,
    following: () => userLoader.loadMany(user._doc.following),
    username: user.username,
    profile_pic_url: user.profile_pic_url
  };
};

const transformLikedAndSaved = (liked) => {
  return {
    ...liked._doc,
    _id: liked.id,
    user: user.bind(this, liked._doc.user),
    media: singleMedia.bind(this, liked._doc.media)
  };
};

const transformComment = (result) => {
  return {
    ...result._doc,
    _id: result.id,
    creator: user.bind(this, result._doc.creator),
    media: singleMedia.bind(this, result._doc.media)
  };
};

const transformFollow = (result) => {
  return {
    ...result._doc,
    _id: result.id,
    following: user.bind(this, result._doc.following),
    followed: user.bind(this, result._doc.followed)
  };
};

const transformSave = (save) => {
  return {
    ...save._doc,
    _id: save.id,
    user: user.bind(this, save._doc.user),
    media: singleMedia.bind(this, save._doc.media)
  };
};

exports.transformMedia = transformMedia;
exports.transformLikedAndSaved = transformLikedAndSaved;
exports.singleMedia = singleMedia;
exports.transformComment = transformComment;
exports.transformProfileData = transformProfileData;
exports.transformFollow = transformFollow;
exports.transformSave = transformSave;
exports.transformTimelineMyData = transformTimelineMyData;
