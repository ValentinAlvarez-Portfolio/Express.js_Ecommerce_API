import { Router } from "express";

import { UsersController } from "../../controllers/users/users.controller.js";
import { AuthController } from "../../controllers/auth/auth.controller.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get('/checkSession', authController.checkSession.bind(authController))
authRouter.get('/logout', authController.logout.bind(authController));

authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/login/admin', authController.loginAdmin.bind(authController));
authRouter.post('/sendResetPassword', UsersController.resetPasswordRequest);
authRouter.post('/resetPassword/:token', UsersController.resetPassword);

export default authRouter;
