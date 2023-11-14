export const successResponse = (status, message, data) => {
      return {
            status: status,
            message: message,
            payload: data,
      }
}

export const errorResponse = (status, message, error) => {

      return {
            status: status,
            message: message,
            details: {
                  method: error.method,
                  url: error.url,
            }
      }
}

export const HTTP_STATUS = {
      OK: {
            status: 200,
            message: 200 + ': OK'
      },
      CREATED: {
            status: 201,
            message: 201 + ': Created'
      },
      BAD_REQUEST: {
            status: 400,
            message: 400 + ': Bad Request'
      },
      UNAUTHORIZED: {
            status: 401,
            message: 401 + ': Unauthorized'
      },
      NOT_FOUND: 404,
      SERVER_ERROR: {
            status: 500,
            message: 500 + ': Server Error'
      },
};

export class HttpError {

      constructor(description, status = 500, details = null) {

            this.description = description;
            this.status = status;
            this.details = details;

      }

}