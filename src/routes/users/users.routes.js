import {
      Router
} from "express";

import {
      UsersController
} from "../../controllers/users/users.controller.js";

import {
      authFromCookie as authMiddleware,
      authAdmin as adminMiddleware,
      authFromHeader
} from "../../middlewares/auth.middleware.js";

import passport from "passport";

import upload from "../../middlewares/multer.middleware.js";

const usersRouter = Router();

usersRouter.get('/github', passport.authenticate('github', {
      scope: ['user: email']
}), UsersController.loginGithub);
usersRouter.get('/githubcallback', passport.authenticate('github', {
      failureRedirect: '/login'
}), UsersController.loginGithubCallback);
usersRouter.get('/', adminMiddleware, UsersController.getAll);
usersRouter.post('/login', authFromHeader, UsersController.loginOne);
usersRouter.post('/login/admin', UsersController.loginAdmin);
usersRouter.post('/register', UsersController.addOne);
usersRouter.post('/logout', authMiddleware, UsersController.logout);
usersRouter.post('/:id/documents', upload.array('documents'), UsersController.uploadDocuments);
usersRouter.put('/premium', adminMiddleware, UsersController.updateRole);
usersRouter.put('/premium/:id', adminMiddleware, UsersController.updateRole);
usersRouter.put('/update', UsersController.updateOne);
usersRouter.delete('/delete', authMiddleware, UsersController.deleteOne);
usersRouter.delete('/deleteInactive', adminMiddleware, UsersController.deleteInactive);
usersRouter.post('/sendResetPassword', UsersController.resetPasswordRequest);
usersRouter.post('/resetPassword/:token', UsersController.resetPassword);

export default usersRouter;