import {
    getRepositories
} from '../../models/repositories/index.repository.js';

import {
    HTTP_STATUS
} from '../../utils/responses/responses.utils.js';

import {
    prepareProductsSuccessResponse as successResponse
} from '../../middlewares/responses.middleware.js';

import {
    logService
} from '../../services/logger.service.js';

import {
    sendDeletedProductEmail
} from '../../utils/mailing/mailing.utils.js';

import {
    verifyJWT
} from '../../utils/JWT/jwt.utils.js';

const {
    productsRepository
} = getRepositories();

export class ProductsController {

    static async getAll(req, res, next) {

        try {

            let {
                limit = 10, page = 1, sort, query
            } = req.query;

            limit = parseInt(limit);
            page = parseInt(page);
            query !== undefined ? query = query.toString() : query = undefined;

            const result = await productsRepository.getAll({
                limit,
                page,
                sort,
                query
            });

            res.send({
                ...result
            });

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })


        };

    };

    static async getById(req, res, next) {

        try {
            const {
                _id
            } = req.params;

            const product = await productsRepository.getById(_id);

            req.message = `Producto ${product.payload.title}, encontrado correctamente en la base de datos`;
            req.payload = product;
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

    static async addOne(req, res, next) {

        try {

            const product = req.body;
            const token = req.cookies.auth;

            const user = verifyJWT(token);

            const result = await productsRepository.addOne(product, user);

            req.message = `Producto ${product.title}, creado correctamente en la base de datos`;
            req.payload = result;
            req.HTTP_STATUS = HTTP_STATUS.CREATED;

            successResponse(req, res, () => {
                res.status(HTTP_STATUS.CREATED.status).json(req.successResponse);
            });

        } catch (error) {

            logService(HTTP_STATUS.SERVER_ERROR, req, error);

            next({
                message: error.message,
                status: HTTP_STATUS.SERVER_ERROR.status
            })


        };

    };

    static async updateOne(req, res, next) {

        try {

            const {
                id
            } = req.params;

            const product = req.body;
            const token = req.cookies.auth;
            const user = verifyJWT(token);

            const result = await productsRepository.updateOne(id, product, user.payload);

            req.message = `Producto ${result.payload.title}, actualizado correctamente en la base de datos`;
            req.payload = result.payload;
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

    static async deleteOne(req, res, next) {

        try {

            const {
                id
            } = req.params;

            const token = req.cookies.auth;
            const user = verifyJWT(token);

            const result = await productsRepository.deleteOne(id, user.payload);

            try {

                if (result.email) await sendDeletedProductEmail(result.email, result.payload);

            } catch (error) {

                logService(HTTP_STATUS.SERVER_ERROR, req, error);

                next({
                    message: error.message,
                    status: HTTP_STATUS.SERVER_ERROR.status
                })

            }

            req.message = `Producto ${result.payload.title}, eliminado correctamente en la base de datos`;
            req.payload = result.payload;
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