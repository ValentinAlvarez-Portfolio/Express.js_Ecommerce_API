import BadRequestException from "../../common/exceptions/factory/badRequest-exception.js";

import { getDAOS } from "../../models/daos/index.daos.js";
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
      
}