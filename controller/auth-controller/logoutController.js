

const logoutController = async (req,res) =>{
    try {
        res.clearCookie("token");
        res.status(200).json({
            success: true,
            message: "User logged out successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = logoutController;