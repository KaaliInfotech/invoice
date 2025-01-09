const User = require("../models/auth");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const OTP = require("../models/otp");
const axios = require("axios");

module.exports.signup = async (req, res) => {
  const { firstname, email, password, confirmpassword } = req.body;

  if (!firstname || !email || !password || !confirmpassword) {
    return res.status(400).json({
      message:
        "Please provide all required fields (firstname, email, password)",
    });
  }

  if (password !== confirmpassword) {
    return res.status(400).json({
      message: "Password and confirm password do not match",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpData = new OTP({
      email,
      otp,
      firstname,
      password,
      createdAt: Date.now(),
    });
    await otpData.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Signup OTP From Invoice Generator",
      text: `Your OTP for registration is ${otp}.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message:
        "OTP sent successfully. Please verify the OTP to complete registration.",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

module.exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Please provide email and otp" });
  }

  try {
    const otpData = await OTP.findOne({ email, otp });

    if (!otpData) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }

    const otpExpiryTime = 10 * 60 * 1000;
    if (Date.now() - otpData.createdAt > otpExpiryTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(otpData.password, 10);

    const newUser = new User({
      firstname: otpData.firstname,
      email: otpData.email,
      password: hashedPassword,
    });
    await newUser.save();

    await OTP.deleteOne({ email, otp });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: "User registered successfully.",
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

module.exports.resetpasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpData = new OTP({
      email,
      otp,
      createdAt: Date.now(),
    });
    await otpData.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message:
        "OTP sent successfully. Please check your email to reset the password.",
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Please provide email and otp" });
  }

  try {
    const otpData = await OTP.findOne({ email, otp });

    if (!otpData) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }

    const otpExpiryTime = 10 * 60 * 1000;
    if (Date.now() - otpData.createdAt > otpExpiryTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    await OTP.deleteOne({ email, otp });
    return res.status(201).json({
      message: "OTP verify successfully.",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

module.exports.resetpassword = async (req, res) => {
  const { email, newPassword, confirmpassword } = req.body;

  if (!email || !newPassword || !confirmpassword) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (newPassword !== confirmpassword) {
    return res.status(400).json({
      message: "New password and confirm password do not match",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET
    );

    return res
      .status(201)
      .json({ message: "Password has been reset successfully.", token: token });
  } catch (error) {
    console.error("Error in forget-password:", error);
  }
};
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide both email and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        name: existingUser.firstname,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: "login successful",
      user: {
        id: existingUser._id,
        firstname: existingUser.firstname,
        email: existingUser.email,
      },
      token: token,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
const googleClient = new OAuth2Client(process.env.CLIENTID);
module.exports.signinWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.CLIENTID,
    });

    const payload = ticket.getPayload();
    const { email, given_name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.firstname },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        status: "Success",
        message: "Login successfully.",
        token: token,
      });
    } else {
      try {
        user = await User.create({
          firstname: given_name,
          email,
        });
        const token = jwt.sign(
          { id: user.id, email: user.email, name: user.firstname },
          process.env.JWT_SECRET
        );

        return res.status(201).json({
          status: "Success",
          message: "User created successfully.",
          token: token,
        });
      } catch (dbError) {
        console.error("Database Error:", dbError);
        return res.status(500).json({
          status: "Fail",
          message: "Internal Server Error",
        });
      }
    }
  } catch (error) {
    console.error("Error in Google Sign-Up:", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};


module.exports.Phonepe = async (req, res) => {
  const phonePeBaseURL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
  const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const saltIndex = 1;
  const merchantId = "PGTESTPAYUAT";
  const payload = {
    merchantId: merchantId,
    merchantTransactionId: req.body.orderId,
    merchantUserId: "MUID123",
    amount: req.body.amount,
    redirectUrl: "https://webhook.site/redirect-url",
    redirectMode: "REDIRECT",
    mobileNumber: "9999999999",
    paymentInstrument: { type: "PAY_PAGE" },
  };
  function sha256(data) {
    return crypto.createHash("sha256").update(data).digest("hex");
  }
  const apiendpoint = "/pg/v1/pay";
  const buffreObj = Buffer.from(JSON.stringify(payload), "utf8");
  const base64string = buffreObj.toString("base64");
  const xverify =
    sha256(base64string + apiendpoint + saltKey) + "###" + saltIndex;
  const options = {
    method: "post",
    url: `${phonePeBaseURL}${apiendpoint}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-verify": xverify,
    },
    data: {
      request: base64string,
    },
  };
  axios
    .request(options)
    .then(function (response) {
      console.log(response, "LOG>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      res.send(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

// const phonePeBaseURL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
// const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
// const saltIndex = 1;
// const merchantId = 'PGTESTPAYUAT';

// module.exports.Phonepe = async (req, res) => {
//   const payload = {
//     merchantId: merchantId,
//     merchantTransactionId: req.body.orderId,
//     merchantUserId: 'MUID123',
//     amount: req.body.amount,
//     redirectUrl: 'https://webhook.site/redirect-url',
//     redirectMode: 'REDIRECT',
//     mobileNumber: '9999999999',
//     paymentInstrument: { type: 'PAY_PAGE' },
//   };

//   try {
//     const apiendpoint = '/pg/v1/pay';
//     const bufferObj = Buffer.from(JSON.stringify(payload), 'utf8');
//     const base64string = bufferObj.toString("base64");

//     // Generate the SHA256 hash
//     const hash = crypto.createHash('sha256');
//     hash.update(base64string + apiendpoint + saltKey);
//     const hashedString = hash.digest('hex');

//     const xverify = `${hashedString}###${saltIndex}`;

//     const options = {
//       method: 'post',
//       url: `${phonePeBaseURL}${apiendpoint}`,
//       headers: {
//         accept: 'text/plain',
//         'Content-Type': 'application/json',
//         'X-verify': xverify
//       },
//       data: {
//         request: base64string
//       }
//     };

//     axios
//       .request(options)
//       .then(function (response) {
//         console.log(response.data);
//         res.status(200).json(response.data);
//       })
//       .catch(function (error) {
//         console.error(error);
//         res.status(500).json({ error: error.response ? error.response.data : error.message });
//       });
//   } catch (error) {
//     console.error('Payment initiation failed:', error);
//     res.status(500).json({ error: error.response ? error.response.data : error.message });
//   }
// };
