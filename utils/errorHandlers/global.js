import AppError from "../globals/customError.js"

const globalErrorHandler = (err, req, res, next) => {
    console.log(err)
    next(new AppError(err, 400));
}


export default globalErrorHandler;