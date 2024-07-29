

export default class HttpException extends Error {

      constructor(status = 500, message = `Internal server error`, context = 'httpException', logLevel = 'error') {

            super(message);

            this.status = status ? status : 500;
            this.context = context;
            this.logLevel = logLevel;
            this.instance = this.constructor.name;


      }

      getStatus() {
            return this.status;
      }

      getResponse() {
            return {
                  status: this.status,
                  message: this.message,
                  context: this.context,
                  logLevel: this.logLevel
            }
      }

      getType() {
            return this.instance;
      }

}