
import User from "../../models/USER";


export const seeVerificationRequest = (req, res) => {
    try {
        return res.render("admin/verificationRequest");
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deActivateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.active = false;
        await user.save();
        return res.status(200).json({ message: "User deactivated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};