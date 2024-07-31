import {
      HTTP_STATUS,
      successRes,
} from '../../utils/responses/responses.utils.js';

import { UsersService } from '../../services/users/users.service.js';
import { UpdateUserDto } from '../../models/dtos/users/index.js';


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

                  const result = await this.service.updateRole(id);

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

      async uploadDocuments(req, res, next) {

            try {

                  const { id } = req.user;
                  const files = req.files;

                  const result = await this.service.uploadDocuments(id, files);

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, `Documentos del usuario ${result.email}, subidos correctamente`, result.documents);

            } catch (error) {

                  next(error)

            }

      };

      async updateRole(req, res, next) {

            try {

                  const { id } = req.user;

                  const result = await this.service.updateRole(id);

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, `Rol del usuario ${result}, actualizado correctamente`);

            } catch (error) {

                  next(error)

            }

      }

      async deleteOne(req, res, next) {

            try {

                  const { id } = req.user;

                  const result = await this.service.deleteOne(id);

                  res.clearCookie('auth');

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, `Usuario ${result}, eliminado correctamente`);

            } catch (error) {

                  next(error)

            };

      };

      

};