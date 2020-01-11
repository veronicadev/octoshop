
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
    const indexRole = global.roles.findIndex(r => {
        return r.name === userRole
    })
    if (indexRole !== -1) {
        if (global.roles[indexRole].perms[type].length > 0 && global.roles[indexRole].perms[type].indexOf(action) !== -1) {
            return true;
        }
        return false;
    }
    return false;
}

exports.roles = roles;
exports.rolesRedirect = rolesRedirect;
exports.canUser = canUser;