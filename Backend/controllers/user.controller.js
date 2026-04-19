import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/daraUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Job } from "../models/job.model.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    // console.log(fullname, email, phoneNumber, password, role);

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "user already exist with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {},
    };

    // Handle optional file upload
    const file = req.file;
    if (file) {
      const fileUri = getDataUri(file);
      const cloudinaryResponse = await cloudinary.uploader.upload(
        fileUri.content,
      );
      userData.profile.profilePhoto = cloudinaryResponse.secure_url;
    }

    await User.create(userData);
    return res.status(201).json({
      message: "account created Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Password mismatch",
        success: false,
      });
    }
    if (role != user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
      saveJobs: user.saveJobs,
      interviewReports: user.interviewReports,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Wellcome back ${user.fullname}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const file = req.file;
    // cloudinary ayega idhar
    let cloudResponse = null;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id; // middleware authentication
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    // updating data
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume comes later here...
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
      user.profile.resumeOriginalName = file.originalname; // Save the original file name
    }

    await user.save();

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Job not found.",
        success: false,
      });
    }
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    if (user.saveJobs.includes(jobId)) {
      return res.status(400).json({
        message: "Job already saved.",
        success: false,
      });
    }
    user.saveJobs.push(jobId);
    await user.save();
    return res.status(200).json({
      user,
      message: "Job saved successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate({
      path: "saveJobs",
      populate: { path: "company" },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      savedJobs: user.saveJobs, // full Job documents
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Job not found.",
        success: false,
      });
    }
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }
    if (!user.saveJobs.includes(jobId)) {
      return res.status(400).json({
        message: "Job not saved.",
        success: false,
      });
    }
    user.saveJobs = user.saveJobs.filter((id) => id != jobId);
    await user.save();
    return res.status(200).json({
      savedJobs: user.saveJobs,
      message: "Job removed successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
