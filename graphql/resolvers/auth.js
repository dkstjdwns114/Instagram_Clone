const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

module.exports = {
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
          "https://res.cloudinary.com/anstagram123/image/upload/v1613644236/anstagram/defaultProfile_dsacxp.jpg"
      });
      const result = await user.save();
      return { ...result._doc, password: null, _id: result.id };
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
        expiresIn: "1h"
      }
    );
    return {
      userId: user.id,
      token: token,
      tokenExpiration: 1,
      userName: user.username
    };
  }
};
