import HttpException from "../httpException.js";


export default class BadRequestException extends HttpException {
      
            constructor(message = 'Bad Request', context = 'badRequestException', logLevel = 'error') {
      
                  super(400, message, context, logLevel);
      
            }
      
      }