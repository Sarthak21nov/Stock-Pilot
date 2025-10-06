import User from "../Models/AuthModel.js";
import bcrypt from "bcrypt";

// Admin can add a new user with a role
export const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({ success: true, message: "User created successfully", user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error adding user", error: err.message });
    }
};

// Admin can update user role
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, message: "Role updated successfully", user });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating role", error: err.message });
    }
};

// Admin can delete a user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting user", error: err.message });
    }
};
