const userModel = require("../../models/User");

async function getBlockedUsers(req, res) {
  try {
    const blockedUsers = await userModel.find({ block: true });

    if (blockedUsers.length > 0) {
      await userModel.updateMany(
        { block: true },
        { $set: { hideContent: true } }
      );

      return res.status(200).json({
        message: "Blocked users",
        data: blockedUsers,
      });
    } else {
      await userModel.updateMany({}, { $set: { hideContent: false } });
      return res.status(404).json({ message: "There are no blocked users" });
    }
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = getBlockedUsers;