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

      async getOne(payload) {

            if (payload.email) {

                  return await usersModel.findOne({
                        email: payload.email
                  }).lean();

            }

            return await usersModel.findOne({
                  _id: payload._id
            }).lean();


      };

      async getOneByEmail(email) {

            return await usersModel.findOne({
                  email: email
            }).lean();

      }

      async addOne(payload) {

            return await usersModel.create(payload);

      };

      async updateOne(payload) {

            return await usersModel.findOneAndUpdate({
                  _id: payload._id
            }, payload, {
                  new: true
            });

      };

      async deleteOne(payload, email) {

            return await usersModel.findOneAndDelete(
                  payload.email ? {
                        email: payload.email
                  } : {
                        email: email
                  }
            );

      };

      async deleteInactive(payload) {

            return await usersModel.deleteMany({
                  email: {
                        $in: payload
                  }
            })

      };

};