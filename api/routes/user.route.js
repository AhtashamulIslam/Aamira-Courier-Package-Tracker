import express from "express";
import {signOut} from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router()

router.post('/signout',signOut)

export default router;