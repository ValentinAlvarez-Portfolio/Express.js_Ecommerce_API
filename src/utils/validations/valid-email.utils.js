export const validateEmail = (email) => {

      const emailRegex = /^\w+([\.-]?\w+)*@(?:hotmail|outlook|gmail|coder|github)\.(?:|com|es)+$/i;

      return emailRegex.test(email);

};