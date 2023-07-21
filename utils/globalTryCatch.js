// Global async try-catch function
function asyncTryCatch(asyncFunc) {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch((err) => next(err));
    };
}
