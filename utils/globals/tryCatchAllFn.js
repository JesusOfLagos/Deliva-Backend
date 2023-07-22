// Global async try-catch function
export default function asyncTryCatch(asyncFunc) {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch((err) => next(err));
    };
}
