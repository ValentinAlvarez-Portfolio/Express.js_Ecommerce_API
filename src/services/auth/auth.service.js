import { getDAOS } from "../../models/daos/index.daos.js";

import HttpException from "../../common/exceptions/httpException.js";
import BadRequestException from "../../common/exceptions/factory/badRequest-exception.js";
import UnauthorizedException from "../../common/exceptions/factory/unauthorized-exception.js";

import { generateJWT, verifyJWT } from "../../utils/JWT/jwt.utils.js";
import { UsersService } from "../users/users.service.js";

import { LoginUserDto, RegisterUserDto, ResetPasswordDto } from "../../models/dtos/auth/index.js";

import { sendResetPassword, sendWelcomeEmail } from "../../utils/mailing/mailing.utils.js";

import CONFIG from "../../config/environment/config.js";

import { compareHash, createHash } from "../../utils/bcrypt/bcrypt.utils.js";


const {
      usersMongoDAO
} = getDAOS();

export class AuthService {

      constructor() {

            this.dao = usersMongoDAO;
            this.usersService = new UsersService();

      }

      async checkSession(token) {

            if (!token) throw new UnauthorizedException('Invalid session', UsersService.name);

            const result = verifyJWT(token);

            if (!result) throw new HttpException(500, 'Internal server error', UsersService.name);

           await this.usersService.getOneByEmail(result.payload.email);

            return true;

      }

      async logout(token) {

            if (!token) throw new UnauthorizedException('Invalid session', UsersService.name);

            const result = verifyJWT(token);

            if (!result) throw new HttpException(500, 'Internal server error', UsersService.name);

            await this.updateLogoutActivity(result.payload.email);

            return true;

      }
      
      async updateLogoutActivity(email) {

            const user = await this.usersService.getOneByEmail(email);

            user.last_connection.last_logout = new Date();

            const result = await this.dao.updateOne(user);

            if (!result) throw new BadRequestException('Error updating user', UsersService.name);
            
            return true

      }

      async register(userFormData) {

            const registerUserDto = new RegisterUserDto(userFormData);

            const user = await registerUserDto.handleData();

            const existingUser = await this.dao.getOneByEmail(user.email);

            if (existingUser) throw new BadRequestException('User already exists', UsersService.name);

            const newUser = await this.dao.addOne(user);

            const result = registerUserDto.handleResponse(newUser);

            await sendWelcomeEmail(newUser.email);

            return result;

      }

      async login(userFormData) {

            const loginUserDto = new LoginUserDto(userFormData);

            const { email, password } = await loginUserDto.handleData();

            const user = await this.usersService.getOneByEmail(email);

            const isPasswordValid = await compareHash(password, user);

            if (!isPasswordValid) throw new BadRequestException('Invalid credentials', UsersService.name);

            user.token = await generateJWT({
                  id: user._id,
                  email: user.email,
                  role: user.role
            });

            const result = loginUserDto.handleResponse(user);

            return result;

      }

      async loginAdmin(userFormData) {

            const loginUserDto = new LoginUserDto(userFormData);

            const { email, password } = await loginUserDto.handleData();

            const adminData = {
                  email: CONFIG.ADMIN.email,
                  password: CONFIG.ADMIN.password
            }

            if(email !== adminData.email) throw new BadRequestException('Invalid credentials', UsersService.name);

            const isPasswordValid = await compareHash(password, adminData);

            if (!isPasswordValid) throw new BadRequestException('Invalid credentials', UsersService.name);

            const token = await generateJWT({
                  role: CONFIG.ADMIN.role
            });

            return token;

      }

      async createResetToken(email) {

            const user = await this.usersService.getOneByEmail(email);

            const key = createHash(JSON.stringify(user._id))

            if (!key) throw new BadRequestException('Error creating token', UsersService.name);

            const token = await generateJWT({
                  email,
                  key
            } , '5m');

            return token

      }

      async sendResetToken(email) {

            const token = await this.createResetToken(email);

            const sendedEmail = await sendResetPassword(email, token);

            if (!sendedEmail) throw new BadRequestException('Error sending email', UsersService.name);

            return true;

      }

      async validateKey(id, key) {

            const isValidKey = await compareHash(id, {
                  password: key
            })

            if (!isValidKey) throw new UnauthorizedException('Invalid token', UsersService.name);

            return true;

      }

      async resetPassword(resetPasswordDto, token) {

            await new ResetPasswordDto(resetPasswordDto).validateData();

            const { email, password } = resetPasswordDto;

            const decodedToken = verifyJWT(token);

            if (!decodedToken) throw new UnauthorizedException('Invalid token', UsersService.name);

            if (decodedToken.payload.email !== email) throw new UnauthorizedException('Invalid token', UsersService.name);

            const user = await this.usersService.getOneByEmail(email);

            user.password = createHash(password);

            await this.validateKey(JSON.stringify(user._id), decodedToken.payload.key);

            const result = await this.dao.updateOne(user);

            if (!result) throw new BadRequestException('Error updating password', UsersService.name);

            return true;

      }

}