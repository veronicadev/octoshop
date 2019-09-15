const getFlashMessage = (req, type = "error") => {
    let message = req.flash(type);
    if (message.length > 0) {
        return message[0];
    } else {
        return null;
    }
}

const getValidationMessage = (messages) => {
    let errorMessage = "";
    if (messages && messages.errors.length > 0) {
        messages.errors.forEach(element => {
            errorMessage =  element.msg + errorMessage + ', ';
        });
    }
    return errorMessage;
}
exports.getFlashMessage = getFlashMessage;
exports.getValidationMessage = getValidationMessage;