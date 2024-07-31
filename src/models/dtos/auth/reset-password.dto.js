import { validateEmail } from "../../../utils/validations/valid-email.utils.js";


export class ResetPasswordDto {

      constructor(resetPasswordDto) {

            if (!resetPasswordDto) return;
            
            const {
                  email,
                  password,
                  confirm_password
            } = resetPasswordDto;

            this.email = email;
            this.password = password;
            this.confirm_password = confirm_password;

      }

      async passwordsMatch() {

            if (this.password !== this.confirm_password) {

                  throw new BadRequestException('Passwords do not match', ResetPasswordDto.name);

            }

      }

      async validateData() {

            Object.keys(this).forEach(key => {

                  if (!this[key]) {

                        throw new BadRequestException(`${key} is required`, ResetPasswordDto.name);

                  }

            });

            validateEmail(this.email);

            await this.passwordsMatch();

            return true;

      }

}