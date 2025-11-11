/**
 * Factory class for standardized API responses built for this Application
 *
 * @export
 * @class AppResponse
 * @extends {Error}
 */
export default class AppResponse extends Error {
    public success: boolean;

    constructor(
        public statusCode: number,
        public message: string,
        public data?: unknown,
        public errors?: unknown
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

        this.statusCode = statusCode;
        this.success = (statusCode >= 200 && statusCode < 300);
        this.message = message;
        this.data = data;
        this.errors = errors;

        if(!this.success && Error.captureStackTrace) {
            this.name = this.constructor.name;
            Error.captureStackTrace(this, this.constructor);
        }

        Object.defineProperties(this, {
            statusCode: { enumerable: true },
            success: { enumerable: true },
            message: { enumerable: true },
            data: { enumerable: true },
            errors: { enumerable: true }
        });
    }

    /*
     * 200 Responses
     */
    static OK(message = "OK", data?: unknown): AppResponse {
        return new AppResponse(200, message, data);
    }

    static Created(message = "Created", data?: unknown): AppResponse {
        return new AppResponse(201, message, data);
    }

    static NoContent(message = "No Content"): AppResponse {
        return new AppResponse(204, message);
    }

    /*
     * 400 Responses
     */
    static BadRequest(message = "Bad Request", errors?: unknown): AppResponse {
        return new AppResponse(400, message, undefined, errors);
    }

    static Unauthorized(message = "Unauthorized", errors?: unknown): AppResponse {
        return new AppResponse(401, message, undefined, errors);
    }

    static Forbidden(message = "Forbidden", errors?: unknown): AppResponse {
        return new AppResponse(403, message, undefined, errors);
    }

    static NotFound(message = "Not Found", errors?: unknown): AppResponse {
        return new AppResponse(404, message, undefined, errors);
    }

    /*
     * 500 Responses
     */
    static InternalServerError(message = "Internal Server Error", errors?: unknown): AppResponse {
        return new AppResponse(500, message, undefined, errors);
    }

    /*
     * Custom Responses
     */
    static CustomResponse(statusCode: number, message: string, data?: unknown, errors?: unknown): AppResponse {
        return new AppResponse(statusCode, message, data, errors);
    }
};