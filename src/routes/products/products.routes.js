import {
    Router
} from "express";
import {
    ProductsController
} from "../../controllers/products/products.controller.js";


import {
    authPremium
} from "../../middlewares/auth.middleware.js";

const productsRouter = Router();

productsRouter.get('/', ProductsController.getAll);
productsRouter.get('/:_id', ProductsController.getById);
productsRouter.post('/', authPremium, ProductsController.addOne);
productsRouter.put('/:id', authPremium, ProductsController.updateOne);
productsRouter.delete('/:id', authPremium, ProductsController.deleteOne);

export default productsRouter;