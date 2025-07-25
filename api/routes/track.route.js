import express from "express";
import { createPackage, getPackages } from "../controller/aamiraTracking.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import upload from "../utils/imageUpload.js";

const router = express.Router();

router.post('/create-package/:userId',upload.array("productImage",1),verifyToken,createPackage);
router.get('/get-packages/:userId',verifyToken,getPackages);
router.get('/get-package/:userId',verifyToken,getPackages);


export default router;     