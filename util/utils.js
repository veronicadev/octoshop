const fs = require('fs');
const getFlashMessage = (req, type = "error") => {
    let message = req.flash(type);
    if (message.length > 0) {
        return message[0];
    } else {
        return null;
    }
}

const getValidationMessage = (messages) => {
    let errorMessage = [];
    if (messages && messages.errors.length > 0) {
        messages.errors.forEach(element => {
            errorMessage.push(element.msg);
        });
    }
    return errorMessage.join(', ');
}

const deleteFile = (filePath) =>{
    fs.unlink(filePath, (err) =>{
        if(err) throw(err);
    })
}

exports.getFlashMessage = getFlashMessage;
exports.getValidationMessage = getValidationMessage;
exports.deleteFile = getFlashMessage;