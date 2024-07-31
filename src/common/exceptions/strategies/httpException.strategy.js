

export default class HttpExceptionStrategy {

      handle(exception, request) {
          
        const httpException = exception;
        const status = httpException.getStatus();
        const { method, url } = request;

            const error = httpException.getResponse();
            const instance = httpException.getType();
        const message = error.message;
        const context = `${error.context} in ${method} ${url}`;

        return {
            status,
            payload: {
                  response: {
                        ok: false,
                        message: message,
                        error: instance,
                        meta: {
                              method,
                              url,
                        }
                  },
                  log: {
                        level: error.logLevel ? error.logLevel : 'error',
                        meta: {
                              exceptionType: instance,
                              message: message,
                              context: context,
                        }

                  }
            }
        };
        
    }
}