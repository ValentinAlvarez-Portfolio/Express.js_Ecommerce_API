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

      async getOne(id) {

            const user = await this.dao.getOne(id);

            if (!user) throw new BadRequestException('User not found', UsersService.name);

            return user;

      }

      async getOneByEmail(email) {

            const user = await this.dao.getOneByEmail(email);

            if (!user) throw new BadRequestException('Invalid credentials', UsersService.name);

            return user;

      }

      async updateOne(id, updateUserDto) {

            const user = await this.getOne(id);

            const newUserData = await updateUserDto.handleData();

            const updatedUser = await this.dao.updateOne(id, {
                  ...user,
                  ...newUserData
            });

            if (!updatedUser) throw new BadRequestException('User not updated', UsersService.name);

            const result = updateUserDto.handleResponse(updatedUser);

            return result;

      }

      async updateUserRole(id) {

            const user = await this.getOne(id);

            if(user.role.toLowerCase() === 'premium') throw new BadRequestException('User is already premium', UsersService.name); 

            const missingDocuments = await this.checkDocuments(user.documents);

            if (missingDocuments && missingDocuments.length > 0) {
                  throw new BadRequestException(`Missing documents: ${missingDocuments.join(', ')}`, UsersService.name);
            }

            const result = await this.dao.updateOne(id, {
                  ...user,
                  role: 'PREMIUM'
            });

            if (!result) throw new BadRequestException('User role not updated', UsersService.name);

            return result.email;

      }

      async checkDocuments(documents) {

            const requiredDocuments = {
                  id: ['id', 'identification', 'identificacion'],
                  proofOfAddress: ['address', 'comprobante de domicilio', 'comprobante_de_domicilio', 'proof of address', 'proof_of_address'],
                  accountStatement: ['account', 'statement', 'account statement', 'account_statement', 'estado de cuenta', 'estado_de_cuenta'],
            }

            const documentsNames = documents.map(doc => doc.name.toLowerCase());

            const missingDocuments = Object.entries(requiredDocuments).reduce((missing, [key, value]) => {

                  const isDocumentMissing = value.every(docName => !documentsNames.includes(docName.toLowerCase()));

                  if (isDocumentMissing) {
                        missing.push(key);
                  }

                  return missing;

            }, []);

            return missingDocuments;

      }

      async deleteInactives() {

            const dateReference = new Date();

            dateReference.setDate(dateReference.getDate() - 30); // 30 days of inactivity

            const { deletedCount } = await this.dao.deleteInactives(dateReference);

            if (deletedCount === 0) throw new BadRequestException('No inactives users found', UsersService.name);
            
            return deletedCount;

      }
      
}