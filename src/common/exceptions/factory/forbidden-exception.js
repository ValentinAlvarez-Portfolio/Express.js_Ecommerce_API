import HttpException from "../httpException.js";


export default class ForbiddenException extends HttpException {

      constructor(message = 'Forbidden', context = 'ForbiddenException', logLevel = 'error') {

            super(403, message, context, logLevel);

      }

}