import HttpException from "../httpException.js";


export default class ConflictException extends HttpException {

      constructor(message = 'Conflict', context = 'ConflictException', logLevel = 'fatal') {

            super(409, message, context, logLevel);

      }

}