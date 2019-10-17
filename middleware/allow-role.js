const roles = require('./../util/roles').roles;

module.exports = (rolesAllowed = [roles.CUSTOMER]) =>{
    return (req, res, next) => {
        if(req.user && rolesAllowed.indexOf(req.user.roleType.name)!==-1){
            return next();
        }
        return res.redirect('/');
    }
}