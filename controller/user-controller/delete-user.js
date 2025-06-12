const userModel = require("../../models/User");
async function deleteUserController(req,res){
    const { id } = req.params || request.query || req.body;

    try {
        await userModel.findByIdAndDelete(id);
        
        res.status(200).json({message:"User deleted successfully"})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

module.exports = deleteUserController;