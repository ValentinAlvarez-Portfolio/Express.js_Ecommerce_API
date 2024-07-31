import BadRequestException from "../../../common/exceptions/factory/badRequest-exception.js";


export class UpdateUserDto {

      constructor(updateUserDto) {

            if (!updateUserDto) throw new BadRequestException('Data is required', UpdateUserDto.name);

            const {
                  first_name,
                  last_name,
                  age,
                  phone
            } = updateUserDto;

            this.first_name = first_name;
            this.last_name = last_name;
            this.age = age;
            this.phone = phone;

      }

      async validateData() {

            Object.entries(this).forEach(([key, value]) => {

                  if (!value) delete this[key];

            });

            if(Object.keys(this).length === 0) throw new BadRequestException('At least one field is required', UpdateUserDto.name);

      }

      async handleData() {

            await this.validateData();

            return {
                  first_name: this.first_name,
                  last_name: this.last_name,
                  age: this.age,
                  phone: this.phone
            };

      }

      handleResponse(user) {

            const { email, role, first_name, last_name, age, id } = user;

            return {
                  email,
                  role,
                  first_name,
                  last_name,
                  age,
                  id
            };

      }

}