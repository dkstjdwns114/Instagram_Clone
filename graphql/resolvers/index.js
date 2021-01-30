const bcrypt = require("bcryptjs");

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
  }
};
