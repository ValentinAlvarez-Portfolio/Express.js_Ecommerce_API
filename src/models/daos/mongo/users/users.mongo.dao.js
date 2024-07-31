import usersModel from "../../../schemas/users.schema.js";

export class UsersMongoDAO {

      async getAll(paginationDto) {

            const options = {
                  page: paginationDto.page,
                  limit: paginationDto.limit,
                  select: '-password -__v -documents -password_reset_expires -password_reset_token -age -first_name -last_name',
                  lean: true
            };

            const result = await usersModel.paginate({}, options);

            const { docs, ...meta } = result;

            return {

                  users: docs,
                  meta: {
                        ...meta
                  }

            }

      };

      async getOne(id) {

            return await usersModel.findOne({
                  _id: id
            }).lean();


      };

      async getOneByEmail(email) {

            return await usersModel.findOne({
                  email: email
            }).lean();

      }

      async addOne(userData) {

            return await usersModel.create(userData);

      };

      async updateOne(id, userData) {

            return await usersModel.findOneAndUpdate({
                  _id: id
            }, userData, {
                  new: true
            });

      };

      async deleteOne(id) {

            return await usersModel.deleteOne({
                  _id: id
            });

      };

      async deleteInactives(dateReference) {

            return await usersModel.deleteMany({
                  $and: [
                        {
                        $or: [
                              { 'last_connection.last_login': { $lt: dateReference } },
                              { 'last_connection.last_login': { $exists: false } }
                        ]
                        },
                        {
                        $or: [
                              { 'last_connection.last_logout': { $lt: dateReference } },
                              { 'last_connection.last_logout': { $exists: false } }
                        ]
                        }
                  ],
                  role: { $ne: 'admin' }
            });

      }

};