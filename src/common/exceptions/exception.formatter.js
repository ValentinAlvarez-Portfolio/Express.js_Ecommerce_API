import HttpException from "./httpException.js";
import GenericExceptionStrategy from "./strategies/genericException.strategy.js";
import HttpExceptionStrategy from "./strategies/httpException.strategy.js";


export default class ExceptionFormatter {

      static strategies = {
            httpException: new HttpExceptionStrategy(),
            genericException: new GenericExceptionStrategy()
      }

      static getStrategy(exception) {

            if (exception instanceof HttpException) {
                  return this.strategies.httpException;
            }

            return this.strategies.genericException;

      }

      static format(exception, request) {

            const strategy = this.getStrategy(exception);

            return strategy.handle(exception, request);

      }

}