const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utils/error")
const jwt = require("jsonwebtoken");


exports.userSignup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(201).json("user created successsfully");
  } catch (error) {
    next(error);
  }
};

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = user._doc;
     res.status(200).json({rest,token});
  } catch (error) {
    next(error);
  }
};

exports.userLogout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
}

