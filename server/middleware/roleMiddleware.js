const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Make sure authentication middleware
    // has already attached the user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first."
      });
    }

    // Check user's role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to access this resource."
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles
};