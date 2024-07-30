import { HTTP_STATUS,successRes } from "../../utils/responses/responses.utils.js";

import { AuthService } from "../../services/auth/auth.service.js";
export class AuthController {

      constructor() {

            this.formattedSuccessRes = this.formattedSuccessRes.bind(this);
            this.service = new AuthService();
      
      }

      formattedSuccessRes(res, statusCode, message, payload) {

            const response = successRes(statusCode, message, payload);

            res.status(statusCode).json(response);

      }

      async checkSession(req, res, next) {

            try {

                  const auth = req.cookies.auth;

                  await this.service.checkSession(auth);

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, 'Sesión activa');


            } catch (error) {

                  next(error);

            }

      };

      async logout(req, res, next) {

            try {

                  const auth = req.cookies.auth;

                  await this.service.logout(auth); 

                  res.clearCookie('auth', {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                  });

                  res.redirect('/');

            } catch (error) {

                  next(error);

            };

      };

      async register(req, res, next) {

            try {

                  const userFormData = req.body;

                  const result = await this.service.register(userFormData);

                  this.formattedSuccessRes(res, HTTP_STATUS.CREATED.status, 'Usuario creado correctamente', result);

            } catch (error) {

                  next(error)

            };

      };

      async login(req, res, next) {

            try {

                  const userFormData = req.body;

                  const result = await this.service.login(userFormData);

                  const { token, ...user } = result;

                  res.setHeader('Authorization', `Bearer ${token}`);

                  res.cookie('auth', token, {
                        maxAge: 60 * 60 * 1000,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                  }); 
                  
                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, 'Sesión iniciada correctamente', user);
                  
            } catch (error) {


                  next(error);

            };

      };

      async loginAdmin(req, res, next) {

            try {

                  const userFormData = req.body;

                  const result = await this.service.loginAdmin(userFormData);

                  res.cookie('auth', result, {
                        httpOnly: true,
                        maxAge: 60 * 60 * 1000,
                  });

                  this.formattedSuccessRes(res, HTTP_STATUS.OK.status, 'Sesión iniciada correctamente');


            } catch (error) {

                  next(error);

            };

      };

}