const Room = require("../models/Room");

// @desc    Initialize or get private chat room
// @route   POST /api/rooms/init
// @access  Private
const initRoom = async (req, res) => {
  try {
    const { otheruser } = req.body;

    // Validate input
    if (!otheruser) {
      return res.status(400).json({
        success: false,
        message: "Other user is required to create a chat room",
      });
    }

    // Prevent self-chat
    if (otheruser === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot create chat with yourself",
      });
    }

    // Check if room already exists
    let room = await Room.findOne({
      isPrivate: true,
      participants: { $all: [req.user._id, otheruser] },
    }).populate("participants", "-password");

    // Create new room if not exists
    if (!room) {
      room = await Room.create({
        participants: [req.user._id, otheruser],
        isPrivate: true,
      });

      room = await room.populate("participants", "-password");
    }

    // Format users as per API doc
    const users = room.participants.map((user) => ({
      _id: user._id,
      fullName: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }));

    return res.status(200).json({
      success: true,
      data: {
        _id: room._id,
        users,
      },
      message: "Room initialized successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while initializing room",
    });
  }
};

// @desc    Get all chat rooms for logged-in user
// @route   GET /api/rooms/userrooms
// @access  Private
const getUserRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      participants: req.user._id,
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    const formattedRooms = rooms.map((room) => ({
      _id: room._id,
      users: room.participants.map((user) => ({
        _id: user._id,
        fullName: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      })),
    }));

    return res.status(200).json({
      success: true,
      data: formattedRooms,
      message: "Rooms fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching rooms",
    });
  }
};


module.exports = { initRoom , getUserRooms };
