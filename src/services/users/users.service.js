import BadRequestException from "../../common/exceptions/factory/badRequest-exception.js";
import { getDAOS } from "../../models/daos/index.daos.js";
import { compareHash } from "../../utils/bcrypt/bcrypt.utils.js";
import { generateJWT } from "../../utils/JWT/jwt.utils.js";
import { LoginUserDto } from "../../models/dtos/users/index.js";
import { PaginationDto } from "../../common/dto/pagination-dto.js";

const {
      usersMongoDAO
} = getDAOS();

export class UsersService {

      constructor() {

            this.dao = usersMongoDAO;

      }

      async getAll(query) {

            const { page, limit } = query;
            
            const paginationDto = new PaginationDto(page, limit);

            const users = await this.dao.getAll(paginationDto);

            if (!users) throw new BadRequestException('Users not found', UsersService.name);
            
            return users;

      }

      async getOneByEmail(email) {

            const user = await this.dao.getOneByEmail(email);

            if (!user) throw new BadRequestException('Invalid credentials', UsersService.name);

            return user;

      }

      async login(userDataForm) {

            const loginUserDto = new LoginUserDto(userDataForm);

            const { email, password } = await loginUserDto.handleData();

            const user = await this.getOneByEmail(email);

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

}