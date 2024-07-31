import {
      HTTP_STATUS,
      successRes,
} from '../../utils/responses/responses.utils.js';

import {
      prepareUsersSuccessResponse as successResponse
} from '../../middlewares/responses.middleware.js';

import {
      getRepositories
} from '../../models/repositories/index.repository.js';

import {
      logService
} from '../../services/logger.service.js';

import {
      sendGoodbyeEmail,
      sendInactiveEmail,
} from '../../utils/mailing/mailing.utils.js';
import { UsersService } from '../../services/users/users.service.js';
import { UpdateUserDto } from '../../models/dtos/users/index.js';


const {
      usersRepository
} = getRepositories();

export class UsersController {

      constructor() {

            this.formattedSuccessRes = this.formattedSuccessRes.bind(this);

            this.service = new UsersService();

      }

      formattedSuccessRes(res, statusCode, message, payload) {

            const response = successRes(statusCode, message, payload);

            res.status(statusCode).json(response);

      }

      // Admin Routes
      async getAll(req, res, next) {

            try {

                  const { query } = req;

                  const result = await this.service.getAll(query);

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, 'Usuarios encontrados correctamente', result);

            } catch (error) {

                  next(error)

            };

      };

      async adminUpdateUserRole(req, res, next) {

            try {

                  const { id } = req.params;

                  const result = await this.service.updateUserRole(id);

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, `Rol del usuario ${result}, actualizado correctamente`);


            } catch (error) {

                  next(error)

            }

      }

      async deleteInactive(req, res, next) {

            try {

                  const result = await this.service.deleteInactives();

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, 'Usuarios inactivos eliminados correctamente', `Usuarios eliminados: ${result}`);

            } catch (error) {

                  next(error)

            }

      };

      // User Routes
      async updateOne(req, res, next) {

            try {

                  const { id } = req.user

                  const updateUserDto = new UpdateUserDto(req.body);

                  const result = await this.service.updateOne(id, updateUserDto)

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, `Usuario ${result.email}, actualizado correctamente`, result);

            } catch (error) {

                  next(error);

            };

      };

      static async uploadDocuments(req, res, next) {

            try {

                  const _id = req.params.id;
                  const files = req.files;

                  const updatedUser = await usersRepository.uploadDocuments(_id, files);

                  req.message = `Usuario ${updatedUser.email}, actualizado correctamente`;
                  req.payload = updatedUser;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  })

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            }

      };

      static async updateRole(req, res, next) {

            try {

                  const _id = req.params.id;
                  const body = req.body;
                  const payload = {
                        email: body.email,
                        _id: _id,
                  }

                  const user = await usersRepository.updateRole(payload);

                  if (!user) {

                        const errorMessage = [`El usuario ${payload}, no existe`]

                        logService(HTTP_STATUS.BAD_REQUEST, req, errorMessage);

                        next({
                              message: errorMessage,
                              status: HTTP_STATUS.BAD_REQUEST.status
                        });

                        return;
                  }

                  req.message = `Rol del usuario ${user.email}, actualizado correctamente`;
                  req.payload = user;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  })

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            }

      }

      static async deleteOne(req, res, next) {

            try {

                  const payload = req.user;

                  const body = req.body;

                  const email = body.email ? body.email : payload.email;

                  const user = await usersRepository.getOne(email);

                  if (!user) {

                        const errorMessage = [`El usuario ${email}, no existe`]

                        logService(HTTP_STATUS.BAD_REQUEST, req, errorMessage);

                        next({
                              message: errorMessage,
                              status: HTTP_STATUS.BAD_REQUEST.status
                        });

                        return;
                  }

                  const deletedUser = await usersRepository.deleteOne({
                        email: user.email
                  });

                  res.clearCookie('auth');

                  req.message = `Usuario ${deletedUser.email}, eliminado correctamente`;
                  req.payload = deletedUser;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  })

                  try {

                        await sendGoodbyeEmail(payload.email);

                  } catch (error) {

                        logService(HTTP_STATUS.SERVER_ERROR, req, error);

                        next({
                              message: error.message,
                              status: HTTP_STATUS.SERVER_ERROR.status
                        });

                  }


            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            };

      };

      

};