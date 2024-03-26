import { Router } from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser, getUser } from "../controllers/user.contoller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:id").get(getUser);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

//secured route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);


export default router;
