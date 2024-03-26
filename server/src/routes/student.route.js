import { Router } from "express";
import { registerStudent, loginStudent, refreshAccessToken, logoutstudent, getAllStudents } from "../controllers/student.contoller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/all-students").get(getAllStudents);

router.route("/register").post(registerStudent);

router.route("/login").post(loginStudent);

//secured route
router.route("/logout").post(verifyJWT, logoutstudent);
router.route("/refresh-token").post(refreshAccessToken);


export default router;
