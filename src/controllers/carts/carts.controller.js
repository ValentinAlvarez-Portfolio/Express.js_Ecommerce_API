import {
    prepareCartsSuccessResponse as successResponse
} from '../../middlewares/responses.middleware.js';

import {
    HTTP_STATUS
} from '../../utils/responses/responses.utils.js';

import {
    logService
} from '../../services/logger.service.js';

import {
    getRepositories
} from '../../models/repositories/index.repository.js';

import {
    generateJWT,
    verifyJWT
} from '../../utils/JWT/jwt.utils.js';

const {
    cartsRepository
} = getRepositories();

export class CartsController {

    static async getAll(req, res, next) {

        try {

            const carts = await cartsRepository.getAll();

            req.message = 'Se obtuvieron todos los carritos';
            req.payload = carts;
            req.HTTP_STATUS = HTTP_STATUS.OK;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            })


        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

    static async getOne(req, res, next) {

        try {

            const {
                code
            } = req.params;

            const userToken = req.cookies.auth;
            const userPayload = verifyJWT(userToken);
            const email = userPayload.payload.email;

            const cart = await cartsRepository.getOne({
                code: code,
                email: email
            });

            const cartToken = generateJWT(cart);

            res.cookie('cart', cartToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

            req.message = 'Se obtuvo el carrito';
            req.payload = cart;
            req.HTTP_STATUS = HTTP_STATUS.OK;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            })

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

    static async saveOne(req, res, next) {

        try {

            const userToken = req.cookies.auth;
            const userPayload = verifyJWT(userToken);
            const email = userPayload.payload.email;
            const result = await cartsRepository.saveOne(email);

            const cartToken = generateJWT(result);

            res.cookie('cart', cartToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

            req.message = 'Se guardó el carrito';
            req.payload = result;
            req.HTTP_STATUS = HTTP_STATUS.CREATED;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            })

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

    static async addProduct(req, res, next) {

        try {

            const {
                productId,
                quantity
            } = req.body;

            const userToken = req.cookies.auth;
            const cartToken = req.cookies.cart;
            const userPayload = verifyJWT(userToken);
            const cartPayload = verifyJWT(cartToken);
            const email = userPayload.payload.email;
            const code = cartPayload.payload.code;

            const result = await cartsRepository.addProduct(code, productId, quantity, email);

            const cartTokenUpdated = generateJWT(result);

            res.cookie('cart', cartTokenUpdated, {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

            req.message = 'Se agregó el producto al carrito';
            req.payload = result;
            req.HTTP_STATUS = HTTP_STATUS.OK;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            });

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

    static async deleteCart(req, res, next) {

        try {
            const {
                code
            } = req.body;

            const userToken = req.cookies.auth;
            const userPayload = verifyJWT(userToken);
            const email = userPayload.payload.email;
            const role = userPayload.payload.role;
            const cartToken = req.cookies.cart ? req.cookies.cart : null;
            const cartPayload = cartToken ? verifyJWT(cartToken) : null;
            const cartCode = cartPayload ? cartPayload.payload.code : null;

            const result = await cartsRepository.deleteCart(code || cartCode, {
                email: email,
                role: role
            });

            res.clearCookie('cart');

            req.message = 'Se eliminó el carrito';
            req.payload = result;
            req.HTTP_STATUS = HTTP_STATUS.OK;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            });

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

    static async deleteProduct(req, res, next) {

        try {
            const {
                productId
            } = req.body;

            const userToken = req.cookies.auth;
            const cartToken = req.cookies.cart;
            const userPayload = verifyJWT(userToken);
            const cartPayload = verifyJWT(cartToken);
            const email = userPayload.payload.email;
            const role = userPayload.payload.role;
            const code = cartPayload.payload.code;

            const result = await cartsRepository.deleteProduct({
                code: code,
                productId: productId,
                email: email,
                role: role
            });

            const cartTokenUpdated = generateJWT(result);

            res.cookie('cart', cartTokenUpdated, {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

            req.message = 'Se eliminó el producto del carrito';
            req.payload = result;
            req.HTTP_STATUS = HTTP_STATUS.OK;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            });

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

    static async purchaseCart(req, res, next) {

        try {

            const cartToken = req.cookies.cart;
            const cartPayload = verifyJWT(cartToken);
            const userToken = req.cookies.auth;
            const userPayload = verifyJWT(userToken);
            const email = userPayload.payload.email;

            const result = await cartsRepository.purchaseCart({
                cart: cartPayload,
                email: email
            });

            const cartTokenUpdated = generateJWT(result);

            res.cookie('cart', cartTokenUpdated, {
                maxAge: 1000 * 60 * 60 * 24 * 30
            });

            req.message = 'Se compró el carrito';
            req.payload = result;
            req.HTTP_STATUS = HTTP_STATUS.OK;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.OK.status).json(req.successResponse);
            });

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })

        };

    };

};