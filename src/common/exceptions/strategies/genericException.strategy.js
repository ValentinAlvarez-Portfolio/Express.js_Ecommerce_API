


export default class GenericExceptionStrategy {

      handle(exception, request) {

            const error = exception instanceof Error ? exception : new Error(exception);

            const { method, url } = request;

            const message = error.message

            const context = `Context unknown in ${method} ${url}`;

            return {

                  status: 500,
                  payload: {
                        response: {
                              ok: false,
                              message: message,
                              error: `Internal Server Error`,
                              meta: {
                                    method,
                                    url,
                              }
                        },
                        log: {
                              level: 'error',
                              meta: {
                                    exceptionType: 'GenericException',
                                    stack: error.stack,
                                    errorName: error.name,
                                    message: message,
                                    context: context,    
                              }
                        }
                  }

            }
 
      }

}