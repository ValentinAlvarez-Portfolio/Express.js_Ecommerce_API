import { Router } from "express";

import { AuthController } from "../../controllers/auth/auth.controller.js";

const authRouter = Router();

const authController = new AuthController();

authRouter.get('/checkSession', authController.checkSession.bind(authController))
authRouter.get('/logout', authController.logout.bind(authController));

authRouter.post('/register', authController.register.bind(authController));
authRouter.post('/login', authController.login.bind(authController));
authRouter.post('/login/admin', authController.loginAdmin.bind(authController));
authRouter.post('/sendResetPassword', authController.sendResetPassword.bind(authController));
authRouter.post('/resetPassword', authController.resetPassword.bind(authController));

export default authRouter;
