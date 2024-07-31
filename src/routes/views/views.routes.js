import {
    Router
} from "express";

import {
    authUser,
    authAdmin,
    authRedirect
} from "../../middlewares/auth.middleware.js";

import {
    ViewsController
} from "../../controllers/views/views.controller.js";

const viewsRouter = Router();

viewsRouter.get('/', authRedirect, ViewsController.home);
viewsRouter.get('/login', ViewsController.login);
viewsRouter.get('/register', ViewsController.register);
viewsRouter.get('/profile', authRedirect, ViewsController.profile);
viewsRouter.get('/products', authRedirect, ViewsController.products);
viewsRouter.get('/admin/updateRole', authRedirect, authAdmin, ViewsController.modifyRole);
viewsRouter.get('/resetPasswordRequest', ViewsController.resetPasswordRequest);
viewsRouter.get('/resetPassword', ViewsController.resetPassword);

export default viewsRouter;