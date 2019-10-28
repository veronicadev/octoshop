
const Role = require('./../models/role');
const roles = {
    ADMIN: "admin",
    CUSTOMER: "customer"
};

const rolesRedirect = {
    ADMIN: "/admin/dashboard",
    CUSTOMER: "/customer/dashboard"
};

const canUser = (action, type, userRole) => {
    Role.find()
        .then(roles => {
                const indexRole = roles.findIndex(r=>{
                    return r.name===userRole
                })
                if(indexRole!==-1){
                    console.log(roles[indexRole].perms[type].indexOf(action)!== -1 && roles[indexRole].perms[type].length>0)
                    if (roles[indexRole].perms[type].length>0 && roles[indexRole].perms[type].indexOf(action)!== -1) {
                        return true;
                    }
                    return false;
                }
                return false;
        })
        .catch(error => {
            return false;
        })
}

exports.roles = roles;
exports.rolesRedirect = rolesRedirect;
exports. canUser = canUser;