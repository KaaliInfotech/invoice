const User = require("../models/auth");

const bcrypt = require("bcrypt");

module.exports.userUpdate = async (req, res) => {
  const { firstname, email, confirmEmail, password, confirmPassword } =
    req.body;

  if (!firstname && !email && !password) {
    return res
      .status(400)
      .send("At least one field (firstname, email, or password) is required.");
  }
  if (email || confirmEmail) {
    if (email !== confirmEmail) {
      return res.status(400).json({
        message: "Email and confirm Email do not match.",
      });
    }
  }
  if (password || confirmPassword) {
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and Repeat Password do not match.",
      });
    }
  }

  try {
    const updateData = {};

    if (firstname) updateData.firstname = firstname;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User successfully updated.",
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};

module.exports.userDelete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(201).json({
      message: "User successfully deleted.",
      data: user
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Internal server error ", error: err.message });
  }
};

module.exports.userSingleView = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "Unauthorized: You can only view your own information.",
      });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(201).json({
      message: "User fetch successfully.",
      user: user,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Internal server error ", error: err.message });
  }
};

module.exports.userList = async (req, res) => {
  try {
    const user = await User.find();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(201).json({
      message: "User fetch successfully.",
      user: user,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Internal server error ", error: err.message });
  }
};

module.exports.getTodayUserList = async (req, res) => {
  try {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

    const todayUser = await User.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    return res.status(201).json({
      message: "Today's users fetched successfully!",
      data: todayUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports.getFilterUserList = async (req, res) => {
  const filter = req.query.filter || 'all'; // Default filter is 'all'

  try {
    let users;

    if (filter === 'all') {
      // Fetch all users
      users = await User.find();
    } else if (filter === 'today') {
      // Fetch users created today
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      users = await User.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


module.exports.changeupgradeStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { upgrade: "true" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(201).json({
      status: 201,
      message: "Upgrade status updated to true",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
};