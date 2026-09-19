const User = require("../models/User");
const Property = require("../models/Property");
const Request = require("../models/Request");

// ==============================
// GET ADMIN DASHBOARD STATS
// ==============================

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOwners,
      totalRegularUsers,
      totalAdmins,
      totalProperties,
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "owner",
      }),

      User.countDocuments({
        role: "user",
      }),

      User.countDocuments({
        role: "admin",
      }),

      Property.countDocuments(),

      Request.countDocuments(),

      Request.countDocuments({
        status: "Pending",
      }),

      Request.countDocuments({
        status: "Approved",
      }),

      Request.countDocuments({
        status: "Rejected",
      }),
    ]);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalOwners,
        totalRegularUsers,
        totalAdmins,

        totalProperties,

        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
      },
    });
  } catch (error) {
    console.error(
      "Get Admin Stats Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET RECENT USERS
// ==============================

const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get Recent Users Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET RECENT PROPERTIES
// ==============================

const getRecentProperties = async (
  req,
  res
) => {
  try {
    const properties =
      await Property.find()
        .populate(
          "ownerId",
          "name email role"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get Recent Properties Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET RECENT REQUESTS
// ==============================

const getRecentRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await Request.find()
        .populate(
          "propertyId",
          "title location price status"
        )
        .populate(
          "ownerId",
          "name email"
        )
        .populate(
          "userId",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(10);

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get Recent Requests Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAdminStats,
  getRecentUsers,
  getRecentProperties,
  getRecentRequests,
};