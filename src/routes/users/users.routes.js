import {
      Router
} from "express";

import {
      UsersController
} from "../../controllers/users/users.controller.js";

import {
      authFromCookie as authMiddleware,
      authAdmin as adminMiddleware
} from "../../middlewares/auth.middleware.js";


import upload from "../../middlewares/multer.middleware.js";

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.get('/', adminMiddleware, usersController.getAll.bind(usersController));
usersRouter.get('/session', UsersController.chechSession);

usersRouter.post('/login', usersController.loginOne.bind(usersController));
usersRouter.post('/login/admin', UsersController.loginAdmin);
usersRouter.post('/register', UsersController.addOne);
usersRouter.post('/logout', UsersController.logout);
usersRouter.post('/:id/documents', upload.array('documents'), UsersController.uploadDocuments);
usersRouter.post('/sendResetPassword', UsersController.resetPasswordRequest);
usersRouter.post('/resetPassword/:token', UsersController.resetPassword);

usersRouter.put('/premium', adminMiddleware, UsersController.updateRole);
usersRouter.put('/premium/:id', adminMiddleware, UsersController.updateRole);
usersRouter.put('/update', authMiddleware, UsersController.updateOne);

usersRouter.delete('/delete', authMiddleware, UsersController.deleteOne);
usersRouter.delete('/deleteInactive', adminMiddleware, UsersController.deleteInactive);




export default usersRouter;