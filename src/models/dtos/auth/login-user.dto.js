import BadRequestException from "../../../common/exceptions/factory/badRequest-exception.js";

import { validateEmail } from "../../../utils/validations/valid-email.utils.js";

export class LoginUserDto {

      constructor(loginUserDto) {

            if (!loginUserDto) return;

            const {
                  email,
                  password
            } = loginUserDto;

            this.email = email;
            this.password = password;

      }

      async validateData() {

            if (!this.email || !this.password) {

                  throw new BadRequestException("Email and password are required", LoginUserDto.name);

            }

            if (!validateEmail(this.email)) {

                  throw new BadRequestException("Email is not valid", LoginUserDto.name);

            }

            return true;

      }

      async handleData() {

            await this.validateData();

            return {
                  email: this.email,
                  password: this.password
            };

      }

      handleResponse(user) {

            const { email, role, first_name, last_name, age, id, token } = user;

            return {
                  email,
                  role,
                  first_name,
                  last_name,
                  age,
                  id,
                  token
            };

      }

}