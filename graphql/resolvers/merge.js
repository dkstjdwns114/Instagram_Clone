const Media = require("../../models/media");
const User = require("../../models/user");

const medias = async (mediaIds) => {
  try {
    const medias = await Media.find({ _id: { $in: mediaIds } });
    return medias.map((media) => {
      return {
        ...media._doc,
        _id: media.id,
        date: +new Date().getTime(),
        creator: user.bind(this, media.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleMedia = async (mediaId) => {
  try {
    const media = await Media.findById(mediaId);
    return {
      ...media._doc,
      _id: media.id,
      creator: user.bind(this, media.creator)
    };
  } catch (err) {
    throw err;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdMedias: medias.bind(this, user._doc.createdMedias)
    };
  } catch (err) {
    throw err;
  }
};

const transformMedia = (media) => {
  return {
    ...media._doc,
    _id: media.id,
    date: media._doc.date,
    creator: user.bind(this, media.creator)
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

exports.transformMedia = transformMedia;
exports.transformLikedAndSaved = transformLikedAndSaved;
exports.singleMedia = singleMedia;
