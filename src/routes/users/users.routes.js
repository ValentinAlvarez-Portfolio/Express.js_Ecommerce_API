import {
      Router
} from "express";

import {
      UsersController
} from "../../controllers/users/users.controller.js";

import {
      authUser,
      authAdmin,
} from "../../middlewares/auth.middleware.js";

import upload from "../../middlewares/multer.middleware.js";

const usersRouter = Router();

const usersController = new UsersController();

// Admin Routes
usersRouter.get('/admin/getAll', authAdmin, usersController.getAll.bind(usersController));

usersRouter.patch('/admin/update/premium/:id', authAdmin, usersController.adminUpdateUserRole.bind(usersController));

usersRouter.delete('/admin/delete/inactives', authAdmin, usersController.deleteInactive.bind(usersController));

// User Routes
usersRouter.patch('/documents', authUser, upload.array('documents'), usersController.uploadDocuments.bind(usersController));

usersRouter.patch('/update', authUser, usersController.updateOne.bind(usersController));
usersRouter.patch('/update/premium', authUser, usersController.updateRole.bind(usersController));

usersRouter.delete('/delete', authUser, usersController.deleteOne.bind(usersController));


export default usersRouter;