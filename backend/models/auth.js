const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      match: [/^[A-Za-z]+$/, "First name should only contain letters"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: 8,
      match:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    },
    otp: { type: String },
    userNumber: {
      type: Number,
      unique: true,
    },
    upgrade: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  const latestUser = await mongoose
    .model("User")
    .findOne()
    .sort({ userNumber: -1 });

  this.userNumber = latestUser ? latestUser.userNumber + 1 : 1;

  next();
});

module.exports = mongoose.model("User", userSchema);
