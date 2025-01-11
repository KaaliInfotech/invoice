const User = require("../models/auth");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const OTP = require("../models/otp");
const axios = require("axios");
const puppeteer = require('puppeteer');

module.exports.instagramDownloader = async (req, res) => {
  const { url } = req.query;

  if (!url) {
      return res.status(400).json({ error: 'Please provide a URL.' });
  }

  try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
      await page.goto(url, { waitUntil: 'networkidle2' });

      const mediaUrl = await page.evaluate(() => {
          if (window.location.hostname.includes('instagram.com')) {
              const videoTag = document.querySelector('video');
              if (videoTag) {
                  return videoTag.src;
              }

              const metaTags = document.querySelectorAll('meta[property="og:image"]');
              if (metaTags.length > 0) {
                  return metaTags[0].content;
              }

              const ogVideoTag = document.querySelector('meta[property="og:video"]');
              if (ogVideoTag) {
                  return ogVideoTag.content;
              }
          }

          if (window.location.hostname.includes('facebook.com')) {
              const videoTag = document.querySelector('video');
              if (videoTag) {
                  return videoTag.src;
              }

              const metaTags = document.querySelectorAll('meta[property="og:image"]');
              if (metaTags.length > 0) {
                  return metaTags[0].content;
              }

              const ogVideoTag = document.querySelector('meta[property="og:video"]');
              if (ogVideoTag) {
                  return ogVideoTag.content;
              }
          }

          return null; 
      });

      await browser.close();

      if (mediaUrl) {
          console.log(mediaUrl); 
          res.json({ downloadUrl: mediaUrl }); k
      } else {
          res.status(404).json({ error: 'Media not found.' }); 
      }
  } catch (error) {
      console.error(error.message); 
      res.status(500).json({ error: 'Failed to fetch media.' });
  }
}

const ytdl = require("@distube/ytdl-core");

module.exports.youtubeDownloader = async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("Please provide a video URL.");
  }

  try {
    const isValidUrl = ytdl.validateURL(videoUrl);
    if (!isValidUrl) {
      return res.status(400).send("Invalid YouTube URL.");
    }

    const videoInfo = await ytdl.getInfo(videoUrl);

    const format = videoInfo.formats.find(
      (f) => f.hasVideo && f.hasAudio
    );

    if (!format || !format.url) {
      return res.status(500).send("No downloadable format found.");
    }

    res.json({
      message: "Video URL fetched successfully.",
      downloadUrl: format.url,
      title: videoInfo.videoDetails.title,
      quality: format.qualityLabel,
      duration: `${Math.floor(videoInfo.videoDetails.lengthSeconds / 60)}:${
        videoInfo.videoDetails.lengthSeconds % 60
      }`,
    });
  } catch (error) {
    console.error("Error Details:", error);

    if (error.message.includes("Could not extract functions")) {
      return res.status(500).send("YouTube has updated its API. Please try again later.");
    }

    res.status(500).send("Failed to process video.");
  }
  
}
module.exports.signup = async (req, res) => {
  const { firstname, email, password, confirmpassword } = req.body;

  if (!firstname || !email || !password || !confirmpassword) {
    return res.status(400).json({
      message:
        "Please provide all required fields (firstname, email, password)",
    });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
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

const MERCHANT_KEY="96434309-7796-489d-8924-ab56988a6076"
const MERCHANT_ID="PGTESTPAYUAT86"
const MERCHANT_BASE_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
const MERCHANT_STATUS_URL="https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status"

const redirectUrl="http://localhost:5001/api/auth/status"

const successUrl="http://localhost:3001/"
const failureUrl="http://localhost:3001/"
module.exports.newPayment = async (req, res) => {

  const {name, mobileNumber, amount, transactionId} = req.body;

  //payment
  const paymentPayload = {
      merchantId : MERCHANT_ID,
      merchantUserId: name,
      mobileNumber: mobileNumber,
      amount : amount * 100,
      merchantTransactionId: transactionId,
      redirectUrl: `${redirectUrl}/?id=${transactionId}`,
      redirectMode: 'POST',
      paymentInstrument: {
          type: 'PAY_PAGE'
      }
  }

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
  const keyIndex = 1
  const string  = payload + '/pg/v1/pay' + MERCHANT_KEY
  const sha256 = crypto.createHash('sha256').update(string).digest('hex')
  const checksum = sha256 + '###' + keyIndex

  const option = {
      method: 'POST',
      url:MERCHANT_BASE_URL,
      headers: {
          accept : 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
      },
      data :{
          request : payload
      }
  }
  try {
      
      const response = await axios.request(option);
      console.log(response.data.data.instrumentResponse.redirectInfo.url)
       res.status(200).json({msg : "OK", url: response.data.data.instrumentResponse.redirectInfo.url})
  } catch (error) {
      console.log("error in payment", error)
      res.status(500).json({error : 'Failed to initiate payment'})
  }

}

module.exports.checkStatus = async (req, res) => {
  const merchantTransactionId = req.query.id;

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "GET",
    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
  };

  axios.request(option).then((response) => {
    if (response.data.success === true) {
      return res.redirect(successUrl);
    } else {
      return res.redirect(failureUrl);
    }
  });
};
