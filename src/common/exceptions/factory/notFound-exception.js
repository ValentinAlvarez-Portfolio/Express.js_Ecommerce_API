import HttpException from "../httpException.js";


export default class NotFoundException extends HttpException {

      constructor(message = 'Resource not found', context = 'notFoundException', logLevel = 'info') {

            super(404, message, context, logLevel);

      }

}