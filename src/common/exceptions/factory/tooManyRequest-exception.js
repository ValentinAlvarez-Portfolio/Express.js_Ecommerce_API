import HttpException from "../httpException.js";


export default class TooManyRequest extends HttpException {

      constructor(message = 'Too Many Request', context = 'TooManyRequest', logLevel = 'error') {

            super(429, message, context, logLevel);

      }

}