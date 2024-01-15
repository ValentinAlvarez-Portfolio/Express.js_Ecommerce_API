import {
    Router
} from "express";
import {
    ProductsController
} from "../../controllers/products/products.controller.js";


import {
    authPremium as premiumMiddleware,
    authFromCookie as authMiddleware,
} from "../../middlewares/auth.middleware.js";

const productsRouter = Router();

productsRouter.get('/', authMiddleware, ProductsController.getAll);
productsRouter.get('/:_id', ProductsController.getById);
productsRouter.post('/', premiumMiddleware, ProductsController.addOne);
productsRouter.put('/:id', premiumMiddleware, ProductsController.updateOne);
productsRouter.delete('/:id', premiumMiddleware, ProductsController.deleteOne);

export default productsRouter;