import { validateEmail } from "../../../utils/validations/valid-email.utils.js";
import BadRequestException from "../../../common/exceptions/factory/badRequest-exception.js";


export class RegisterUserDto {

      constructor(registerUserDto) {

            if (!registerUserDto) return;

            const {
                  email,
                  password,
                  confirm_password,
                  first_name,
                  last_name,
                  age
            } = registerUserDto;

            this.email = email;
            this.password = password;
            this.confirm_password = confirm_password;
            this.first_name = first_name;
            this.last_name = last_name;
            this.age = age;

      }

      async passwordsMatch() {

            if (this.password !== this.confirm_password) {

                  throw new BadRequestException('Passwords do not match', RegisterUserDto.name);

            }

      }

      async validateData() {

            Object.keys(this).forEach(key => {

                  if (!this[key]) {

                        throw new BadRequestException(`${key} is required`, RegisterUserDto.name);

                  }

            });

            validateEmail(this.email);

            await this.passwordsMatch();

            return true;

      }

      async handleData() {

            await this.validateData();

            return {
                  email: this.email,
                  password: this.password,
                  first_name: this.first_name,
                  last_name: this.last_name,
                  age: this.age
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