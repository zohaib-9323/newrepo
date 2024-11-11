const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists", success: false });
        }
        const newUser = new UserModel({ firstName, lastName, email });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();
        res.status(200).json({ message: "Signup successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password", success: false });
        }
        
        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: "Login successful",
            success: true,
            token,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body; // Extract only email from the request body
        
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }

        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found", success: false });
        }

        return res.status(200).json({ message:"Success", success: true });

        // const newPassword  = req.body;
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // user.password = hashedPassword;
        // await user.save();

        // res.status(200).json({ message: "Password reset successful", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false, err });
    }
};

const ResetPassword = async (req, res) => {
    try {
        const { email,newPassword } = req.body; // Extract only email from the request body
        
        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found", success: false });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successful", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false, err });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 }); // Exclude password field
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = {
    signup,
    login,
    forgotPassword,
    ResetPassword,
    getUsers
};
