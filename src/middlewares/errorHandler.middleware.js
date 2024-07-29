import ExceptionFormatter from "../common/exceptions/exception.formatter.js"
import { Logger } from "../common/logger/logger.js";

const logger = new Logger();

const errorHandler = (err, req, res, next) => {

      const { status, payload } = ExceptionFormatter.format(err, req);

      if(payload.log.logLevel === 'fatal' || payload.log.logLevel === 'error' || payload.log.logLevel === 'warning') {
            logger.sendLog(req, payload.log);
      }
      
      res.status(status).json(payload.response);
      
};

export default errorHandler;