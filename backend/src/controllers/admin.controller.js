// backend/controllers/admin.controller.js
import User from "../models/user.model.js";
import SendPost from "../models/sendPost.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await SendPost.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalModerators = await User.countDocuments({ role: 'moderator' });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    const newPostsThisWeek = await SendPost.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Posts by programming language
    const postsByLanguage = await SendPost.aggregate([
      {
        $group: {
          _id: "$programmingLanguage",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // User registration trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userRegistrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    // Most active users (by post count)
    const mostActiveUsers = await SendPost.aggregate([
      {
        $group: {
          _id: "$senderId",
          postCount: { $sum: 1 }
        }
      },
      { $sort: { postCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.fullName": 1,
          "user.email": 1,
          "user.profilePic": 1,
          postCount: 1
        }
      }
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        totalPosts,
        totalAdmins,
        totalModerators,
        newUsersThisWeek,
        newPostsThisWeek
      },
      postsByLanguage,
      userRegistrationTrend,
      mostActiveUsers
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(query);

    // Get post count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const postCount = await SendPost.countDocuments({ senderId: user._id });
        return {
          ...user.toObject(),
          postCount
        };
      })
    );

    res.status(200).json({
      users: usersWithStats,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent self-demotion
    if (userId === req.user._id.toString() && role && role !== user.role) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (reason) updateData.statusReason = reason;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');


    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-deletion
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user's posts
    await SendPost.deleteMany({ senderId: userId });

    // Delete user
    await User.findByIdAndDelete(userId);


    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPostsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const language = req.query.language || '';
    const privacy = req.query.privacy || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { projectCode: { $regex: search, $options: 'i' } }
      ];
    }

    if (language) {
      query.programmingLanguage = language;
    }

    if (privacy) {
      query.privacy = privacy;
    }

    const posts = await SendPost.find(query)
      .populate('senderId', 'fullName email profilePic')
      .populate('comments.author', 'fullName profilePic')
      .sort({ [sortBy]: sortOrder })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalPosts = await SendPost.countDocuments(query);

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;

    const post = await SendPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await SendPost.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSystemSettings = async (req, res) => {
  try {
    // This would typically come from a settings collection
    // For now, we'll return some basic system info
    const settings = {
      siteName: "CodeShare",
      version: "1.0.0",
      maintenance: false,
      registrationEnabled: true,
      maxFileSize: "10MB",
      allowedFileTypes: ["js", "py", "java", "cpp", "html", "css"],
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      },
      emailSettings: {
        provider: "smtp",
        enabled: true
      },
      security: {
        captchaEnabled: true,
        maxLoginAttempts: 5,
        lockoutDuration: 30 // minutes
      }
    };

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

