import {
      successResponse
} from "../utils/responses/responses.utils.js";

export const errorHandlerMiddleware = (error, req, res, next) => {

      const status = error.status || 500;
      const message = error.message || 'Un error inesperado ha ocurrido.';

      const errorMessage = typeof message === 'string' ? message : JSON.stringify(message);

      res.status(status).json({
            status: status,
            error: errorMessage,
            method: req.method,
            url: req.originalUrl,
      });

};

export const prepareUsersSuccessResponse = (req, res, next) => {

      const {
            message,
            payload,
            HTTP_STATUS
      } = req;

      req.successResponse = successResponse(HTTP_STATUS.message, message, payload);

      if (req.successResponse.payload) {
            req.successResponse.payload.password ? delete req.successResponse.payload.password : null;
            req.successResponse.payload.token ? delete req.successResponse.payload.token : null;
            req.successResponse.payload._id ? delete req.successResponse.payload._id : null;
            req.successResponse.payload.age ? delete req.successResponse.payload.age : null;
            req.successResponse.payload.last_name ? delete req.successResponse.payload.last_name : null;
            req.successResponse.payload.date_created ? delete req.successResponse.payload.date_created : null;
            req.successResponse.payload.__v ? delete req.successResponse.payload.__v : null;
            req.successResponse.payload.phone ? delete req.successResponse.payload.phone : null;
            req.successResponse.payload.password_reset_token ? delete req.successResponse.payload.password_reset_token : null;
            req.successResponse.payload.password_reset_expires ? delete req.successResponse.payload.password_reset_expires : null;

            const lastConnection = req.successResponse.payload.last_connection ? req.successResponse.payload.last_connection : null;

            if (lastConnection) {
                  lastConnection.last_login ? lastConnection.last_login = lastConnection.last_login.toLocaleDateString() : null;
                  lastConnection.last_logout ? lastConnection.last_logout = lastConnection.last_logout.toLocaleDateString() : null;
                  req.successResponse.payload.last_connection = lastConnection;
            }
      }

      next();

}

export const prepareProductsSuccessResponse = (req, res, next) => {

      const {
            message,
            payload,
            HTTP_STATUS
      } = req;

      req.successResponse = successResponse(HTTP_STATUS.message, message, payload);

      if (req.successResponse.payload) {
            req.successResponse.payload._id ? delete req.successResponse.payload._id : null;
            req.successResponse.payload.owner ? delete req.successResponse.payload.owner : null;
            req.successResponse.payload.adminOwner ? delete req.successResponse.payload.adminOwner : null;
            req.successResponse.payload.__v ? delete req.successResponse.payload.__v : null;
      }

      next();

}

export const prepareCartsSuccessResponse = (req, res, next) => {

      const {
            message,
            payload,
            HTTP_STATUS
      } = req;

      req.successResponse = successResponse(HTTP_STATUS.message, message, payload);

      // Agregar filtros para eliminar datos sensibles

      next();

}