export function logService(status, req, error) {

      let errorAt = error.stack ? error.stack.split('\n    at ')[1] : '';

      if (status.status === 500) {

            req.logger.warning({
                  status: status.status,
                  message: status.message + ' ' + error.message,
                  method: req.method,
                  url: req.originalUrl,
                  date: new Date().toLocaleDateString(),
                  At: errorAt
            });

            return;

      } else if (status === 400 || status === 404) {

            req.logger.error({
                  status: status.status,
                  message: status.message + ' ' + error.message,
                  method: req.method,
                  url: req.originalUrl,
                  date: new Date().toLocaleDateString(),
                  At: errorAt
            });

            return;

      } else {

            req.logger.info({
                  status: status.status,
                  message: status.message + ' ' + error.message,
                  method: req.method,
                  url: req.originalUrl,
                  date: new Date().toLocaleDateString(),
                  At: errorAt
            });

            return;

      }
}