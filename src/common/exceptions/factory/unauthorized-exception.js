import HttpException from "../httpException.js";

export default class UnauthorizedException extends HttpException {
      constructor(message = 'Unauthorized', context = 'UnauthorizedException', logLevel = 'warning') {
            super(401, message, context, logLevel);
      }
}