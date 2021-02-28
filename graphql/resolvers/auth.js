const DataLoader = require("dataloader");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { transformUser } = require("./merge");

const User = require("../../models/user");

const userNameLoader = new DataLoader((username) => {
  return User.find({ username: { $in: username } });
});

module.exports = {
  users: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return transformUser(user);
      });
    } catch (err) {
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
        full_name: args.userInput.full_name,
        password: hashedPassword,
        profile_pic_url:
          "https://res.cloudinary.com/anstagram123/image/upload/v1613644236/anstagram/defaultProfile_dsacxp.jpg",
        introduction: ""
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (args, req) => {
    if (!req.isAuth) throw new Error("Unauthenticated!");
    try {
      const user = await userNameLoader.load(args.updateUserInput.username);

      if (user._id.toString() !== req.userId.toString()) {
        throw new Error("Exist Username!");
      }

      const modifyUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          $set: {
            username: args.updateUserInput.username,
            full_name: args.updateUserInput.full_name,
            profile_pic_url: args.updateUserInput.profile_pic_url,
            introduction: args.updateUserInput.introduction
          }
        },
        { new: true, useFindAndModify: false }
      );
      return modifyUser;
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      {
        expiresIn: "3h"
      }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 3,
      userName: user.username
    };
  }
};
