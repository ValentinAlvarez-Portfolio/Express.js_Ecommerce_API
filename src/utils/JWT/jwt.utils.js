import jwt from "jsonwebtoken";
import CONFIG from "../../config/environment/config.js";

const KEY = CONFIG.KEY;

export const generateJWT = async (payload, expires) => {

      const token = jwt.sign({
            payload
      }, KEY, {
            expiresIn: expires ? expires : '12h'
      })

      return token;

};

export const verifyJWT = (token) => {
      const decoded = jwt.verify(token, KEY);

      return decoded;
};