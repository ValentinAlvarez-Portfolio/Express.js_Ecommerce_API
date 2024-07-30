import BadRequestException from "../../common/exceptions/factory/badRequest-exception.js";

export const validateEmail = (email) => {

      const emailRegex = /^\w+([\.-]?\w+)*@(?:hotmail|outlook|gmail|coder|github)\.(?:|com|es)+$/i;

      const result = emailRegex.test(email);

      if (!result) throw new BadRequestException('Invalid email', validateEmail.name);

      return true;

};