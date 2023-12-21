import {
      HTTP_STATUS,
} from '../../utils/responses/responses.utils.js';

import {
      prepareUsersSuccessResponse as successResponse
} from '../../middlewares/responses.middleware.js';

import {
      getRepositories
} from '../../models/repositories/index.repository.js';

import {
      generateJWT,
} from '../../utils/JWT/jwt.utils.js';

import CONFIG from '../../config/environment/config.js';

import {
      logService
} from '../../services/logger.service.js';

import {
      sendWelcomeEmail,
      sendGoodbyeEmail,
      sendInactiveEmail,
      sendResetPassword,
      sendResetPasswordConfirmation
} from '../../utils/mailing/mailing.utils.js';


const {
      usersRepository
} = getRepositories();

export class UsersController {

      static async getAll(req, res, next) {

            try {

                  const result = await usersRepository.getAll();

                  req.message = `Usuarios encontrados correctamente`;
                  req.payload = result;
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

            };

      };

      static async loginOne(req, res, next) {

            try {

                  const payload = req.body;

                  const user = await usersRepository.getOne(payload);

                  if (!user && payload.email) {

                        req.logger.warning(`El usuario ${payload.email ? payload.email : payload.id}, no existe`);
                        res.status(400).json({
                              message: `El usuario ${payload.email ? payload.email : payload.id}, no existe`
                        });
                        return;
                  }

                  try {

                        const userToLogin = await usersRepository.loginOne(payload, user);

                        const token = generateJWT(userToLogin);

                        res.cookie('auth', token, {
                              maxAge: 60 * 60 * 1000,
                        });

                        req.message = `Usuario ${userToLogin.email}, encontrado correctamente`;
                        req.payload = userToLogin;
                        req.HTTP_STATUS = HTTP_STATUS.OK;

                        successResponse(req, res, () => {
                              res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                        })

                  } catch (error) {

                        logService(HTTP_STATUS.BAD_REQUEST, req, error);

                        next({
                              message: error.message,
                              status: HTTP_STATUS.BAD_REQUEST.status
                        });

                  };

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            };

      };

      static async addOne(req, res, next) {

            try {

                  const payload = req.body;

                  try {

                        const exist = await usersRepository.getOne(payload.email);

                        if (exist) {
                              req.logger.warning(`El usuario ${payload.email}, ya existe`);
                              res.status(400).json({
                                    message: `El usuario ${payload.email}, ya existe`
                              });
                              return;
                        }

                        const newUser = await usersRepository.addOne(payload);

                        req.message = `Usuario ${newUser.email}, creado correctamente`;
                        req.payload = newUser;
                        req.HTTP_STATUS = HTTP_STATUS.CREATED;

                        successResponse(req, res, () => {
                              res.status(HTTP_STATUS.CREATED.status).json(req.successResponse);
                        })

                        try {

                              await sendWelcomeEmail(payload.email);

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

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            };

      };

      static async logout(req, res, next) {

            try {

                  const user = req.user;

                  if (!user) {
                        req.logger.warning(`El usuario ${user.email}, no existe`);
                        return;
                  }

                  const result = await usersRepository.logout(user.email);

                  res.clearCookie('auth');

                  req.message = `Usuario ${user.email}, desconectado correctamente`;
                  req.payload = result;
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
                        req.logger.warning(`El usuario ${payload}, no existe`);
                        res.status(400).json({
                              message: `El usuario ${payload}, no existe`
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

      static async updateOne(req, res, next) {

            try {

                  const email = req.user.email;

                  const payload = req.body;

                  const exist = await usersRepository.getOne(email);

                  if (!exist) {
                        req.logger.warning(`El usuario ${email}, no existe`);
                        res.status(400).json({
                              message: `El usuario ${email}, no existe`
                        });
                        return;
                  }

                  const updatedUser = await usersRepository.updateOne(exist, payload);

                  const token = generateJWT({
                        first_name: updatedUser.first_name,
                        last_name: updatedUser.last_name,
                        email: updatedUser.email,
                        role: updatedUser.role,
                  });

                  res.clearCookie('auth');

                  res.cookie('auth', token, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 1000,
                  });

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

            };

      };

      static async deleteOne(req, res, next) {

            try {

                  const payload = req.user;

                  const body = req.body;

                  const email = body.email ? body.email : payload.email;

                  const user = await usersRepository.getOne(email);

                  if (!user) {
                        req.logger.warning(`El usuario ${email}, no existe`);
                        res.status(400).json({
                              message: `El usuario ${email}, no existe`
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

      static async deleteInactive(req, res, next) {

            try {

                  const deletedUsers = await usersRepository.deleteInactive();

                  req.message = `Usuarios eliminados correctamente`;
                  req.payload = deletedUsers.result.deletedCount + ' usuarios eliminados:' + ' ' + deletedUsers.users;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  })

                  try {

                        await sendInactiveEmail(deletedUsers.users);

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

            }

      };

      static async loginAdmin(req, res, next) {

            try {

                  const payload = req.body;

                  const admin = await usersRepository.loginAdmin(payload);

                  if (admin) {
                        admin.password = undefined;
                  }

                  const token = generateJWT(admin);

                  res.cookie('auth', token, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 1000,
                  });

                  req.message = `Usuario admin encontrado correctamente`;
                  req.payload = admin;
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

            };

      };

      static async resetPasswordRequest(req, res, next) {

            try {

                  const payload = req.body;

                  const updatedUser = await usersRepository.createResetToken(payload);

                  if (!updatedUser) {
                        req.logger.warning(`El usuario ${payload.email}, no existe`);
                        res.status(400).json({
                              message: `El usuario ${payload.email}, no existe`
                        });
                        return;
                  }

                  req.message = `Correo electrónico de restablecimiento de contraseña enviado a ${updatedUser.email} con el endpoint : ${CONFIG.API_URL}/users/resetPassword?token=${updatedUser.password_reset_token}`;
                  req.payload = updatedUser;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  })

                  await sendResetPassword(updatedUser.email, updatedUser.password_reset_token);

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            }

      };

      static async resetPassword(req, res, next) {

            try {

                  const token = req.params.token;

                  const payload = {
                        ...req.body,
                        token
                  }

                  const updatedUser = await usersRepository.resetPassword(payload);

                  await sendResetPasswordConfirmation(payload.email);

                  req.message = `Contraseña de usuario ${updatedUser.email}, actualizada correctamente`;
                  req.payload = updatedUser;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  });

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            }

      };

      static async loginGithub(req, res, next) {
            try {

                  const user = req.user;

                  req.message = `Usuario ${user.email}, encontrado correctamente`;
                  req.payload = user;
                  req.HTTP_STATUS = HTTP_STATUS.OK;

                  successResponse(req, res, () => {
                        res.status(HTTP_STATUS.OK.status).json(req.successResponse);
                  });

            } catch (error) {

                  logService(HTTP_STATUS.SERVER_ERROR, req, error);

                  next({
                        message: error.message,
                        status: HTTP_STATUS.SERVER_ERROR.status
                  });

            }

      }

      static async loginGithubCallback(req, res, next) {

            try {

                  if (req.user) {
                        res.redirect('/profile');
                  } else {
                        res.redirect('/login');
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