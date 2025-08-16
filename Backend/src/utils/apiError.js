/**
 * Custom error class for API errors.
 * Extends the built-in Error class to include HTTP status codes and additional error details.
 *
 * @class
 * @extends Error
 */
export class ApiError extends Error{

    constructor(statusCode,message,errors = [],stack = ""){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        if(stack){
        this.stack = stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}
