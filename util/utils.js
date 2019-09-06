const getFlashMessage = (req, type="error")=>{
    let message = req.flash(type);
    if(message.length>0){
        return message[0];
    }else{
        return null;
    }
}
exports.getFlashMessage =getFlashMessage;