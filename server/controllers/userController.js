const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // 1. Validate input
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Check email conflict
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // 3. Check username conflict
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Generate avatar
    const avatar = `https://avatar.iran.liara.run/username?username=${fullName}`;

    // 6. Create user
    const user = await User.create({
      username,
      name: fullName, // DB field remains `name`
      email,
      password: hashedPassword,
      avatar,
    });

    // 7. Response (STRICT DOC FORMAT)
    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering the user",
    });
  }
};



// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with this email",
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 4. Generate JWT
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Set HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 6. Response (STRICT DOC FORMAT)
    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          fullName: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
        accessToken, // optional but allowed (cookie is primary)
      },
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

// @desc    Get logged-in user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        fullName: req.user.name,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar,
      },
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user",
    });
  }
};


const searchUsers = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    // Validate query param
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user._id } }, // exclude self
      ],
    }).select("-password");

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      fullName: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }));

    return res.status(200).json({
      success: true,
      data: formattedUsers,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while searching users",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production
    });

    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error during logout process",
    });
  }
};

module.exports = { registerUser , loginUser , getMe , searchUsers , logoutUser};
