import HttpException from "../httpException.js";


export default class NotImplementedException extends HttpException {

      constructor(message = 'Not Implemented', context = 'NotImplementedException', logLevel = 'error') {

            super(501, message, context, logLevel);

      }

}