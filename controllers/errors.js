exports.get404 = (req, res, next)=>{
    res.status(404).render("errors/404", {
        docTitle: "404",
        path:'/404'
    });
}

exports.get500 = (req, res, next)=>{
    res.status(500).render("errors/500", {
        docTitle: "500",
        path:'/500'
    });
}

exports.get403 = (req, res, next)=>{
    res.status(403).render("errors/403", {
        docTitle: "403",
        path:'/403'
    });
}

exports.get401 = (req, res, next)=>{
    res.status(401).render("errors/401", {
        docTitle: "401",
        path:'/401'
    });
}