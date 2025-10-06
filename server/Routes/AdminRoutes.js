import express from "express";
import { AdminProtect } from "../Utils/protect.js";
import { addUser, updateUserRole, deleteUser } from "../Controllers/AdminController.js";

const router = express.Router();

router.post("/addUser", AdminProtect, addUser);
router.put("/updateUserRole/:id", AdminProtect, updateUserRole);
router.delete("/deleteUser/:id", AdminProtect, deleteUser);

export default router;
