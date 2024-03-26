import { Router } from "express";
import { getAttendanceRecord, markAttendance } from "../controllers/attendance.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/mark-attendance").post(verifyJWT, markAttendance);
router.route("/records").get(verifyJWT, getAttendanceRecord);

export default router;
