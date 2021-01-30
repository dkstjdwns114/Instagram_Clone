const bcrypt = require("bcryptjs");

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
