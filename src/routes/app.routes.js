import {
      Router
} from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

import usersRouter from './users/users.routes.js';
import usersMocksRouter from './users/users.mocks.routes.js';
import productsRouter from './products/products.routes.js';
import productsMocksRouter from './products/products.mocks.routes.js';
import cartsRouter from './carts/carts.routes.js';
import cartsMocksRouter from './carts/carts.mocks.routes.js';
import viewsRouter from './views/views.routes.js';
import loggerRouter from './logger/logger.routes.js';

import {
      authUser,
      authAdmin
} from '../middlewares/auth.middleware.js';

import {
      addLogger as loggerMiddelware
} from '../middlewares/logger.middleware.js';


import {
      swaggerOptions
} from '../utils/swagger/swagger.utils.js';
import errorHandler from '../middlewares/errorHandler.middleware.js';
import authRouter from './auth/auth.routes.js';

const spec = swaggerJSDoc(swaggerOptions);
const router = Router();

router.use(loggerMiddelware);
router.use('/', viewsRouter);
router.use('/api/loggerTest', loggerRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', usersRouter);
router.use('/api/products', productsRouter);
router.use('/api/carts', authUser, cartsRouter);
router.use('/api/mocks', authAdmin, usersMocksRouter, productsMocksRouter, cartsMocksRouter);
router.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));
router.use(errorHandler);

export default router;