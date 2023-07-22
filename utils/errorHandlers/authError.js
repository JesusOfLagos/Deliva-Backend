const errorHandler = (error) => {
    let errorObject = {};
    if (error.message === "Unsupported Role") {
        errorObject.accountType = "Account Type is invalid";
    }
    if (error.message === "Unsupported Facility") {
        errorObject.facilityType = "Facility Type is invalid";
    }
    if (error.message === "doesn't exist") {
        errorObject.email = "User doesn't exist!";
    }
    if (error.message === "Incorrect Password") {
        errorObject.password = "Incorrect! Please input the correct Password!";
    }
    if (error.message === "Password Length Short") {
        errorObject.password = "Please, ensure password is at least 8 characters long!";
    }
    if (error.message === "Incomplete Details") {
        errorObject.email = "Please, submit your Email and Password";
    }
    if (error.message === "Incorrect Login Details") {
        errorObject.message = "Please, input the right Email and Password";
    }
    if (error.code === 11000) {
        errorObject.email = "Hey! There's an account with that email";
    }
    if (error.message.includes('User validation failed')) {
        const pinPoint = Object.values(error.errors);
        pinPoint.forEach(({ properties }) => {
            errorObject[properties.path] = properties.message;
        });
    }
    if (error.message === 'jwt expired') {
        errorObject.email = "Token Expired!. Please, reset your Account Password again";
    }
    if (error.message === 'password already set') {
        errorObject.password = "The password was previously reset before now";
    }
    return errorObject;
}


export default errorHandler;