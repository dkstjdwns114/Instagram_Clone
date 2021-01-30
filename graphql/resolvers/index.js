const bcrypt = require("bcryptjs");

const Media = require("../../models/media");
const User = require("../../models/user");
const Liked = require("../../models/liked");
const Saved = require("../../models/saved");

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

module.exports = {
  medias: async () => {
    try {
      const medias = await Media.find();
      return medias.map((media) => {
        return {
          ...media._doc,
          _id: media.id,
          creator: user.bind(this, media._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  likeds: async () => {
    try {
      const likeds = await Liked.find();
      return likeds.map((liked) => {
        return {
          ...liked._doc,
          _id: liked.id,
          user: user.bind(this, liked._doc.user),
          media: singleMedia.bind(this, liked._doc.media)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  saveds: async () => {
    try {
      const saveds = await Saved.find();
      return saveds.map((saveds) => {
        return {
          ...saveds._doc,
          _id: saveds.id,
          user: user.bind(this, saveds._doc.user),
          media: singleMedia.bind(this, saveds._doc.media)
        };
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
      createdMedia = {
        ...result._doc,
        _id: result._doc._id.toString(),
        date: +new Date().getTime(),
        creator: user.bind(this, result._doc.creator)
      };
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
  },
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({
        $or: [
          { email: args.userInput.email },
          { username: args.userInput.username }
        ]
      });
      if (existingUser) {
        throw new Error("Email or Username exists already");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        username: args.userInput.username,
        password: hashedPassword,
        profile_pic_url: args.userInput.profile_pic_url
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
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
    const result = await liked.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, result._doc.user),
      media: singleMedia.bind(this, result._doc.media)
    };
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
  },
  savedMedia: async (args) => {
    const fetchedMedia = await Media.findOne({ _id: args.mediaId });
    const saved = new Saved({
      user: "601566f405fd7104d4b911f4",
      media: fetchedMedia
    });
    const result = await saved.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, result._doc.user),
      media: singleMedia.bind(this, result._doc.media)
    };
  },
  cancelSaved: async (args) => {
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
