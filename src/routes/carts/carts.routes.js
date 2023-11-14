import {
    Router
} from 'express';
import {
    CartsController
} from '../../controllers/carts/carts.controller.js';

import {
    authUser as userMiddleware,
    authAdmin as adminMiddleware
} from '../../middlewares/auth.middleware.js';

const cartsRouter = Router();

cartsRouter.get('/', adminMiddleware, CartsController.getAll);
cartsRouter.post('/', CartsController.saveOne);
cartsRouter.delete('/', adminMiddleware, CartsController.deleteCart);
cartsRouter.get('/:code', CartsController.getOne);
cartsRouter.put('/products', userMiddleware, CartsController.addProduct);
cartsRouter.delete('/products', userMiddleware, CartsController.deleteProduct);
cartsRouter.post('/purchase', userMiddleware, CartsController.purchaseCart);

export default cartsRouter;