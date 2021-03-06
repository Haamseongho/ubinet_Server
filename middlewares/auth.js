function loginRequired(request, response, next) {
    if (!request.admin) {
        request.flash("error", "로그인이 필요한 페이지입니다.");
        return response.redirect("/login/");
    }

    next();
}


function logoutRequired(request, response, next) {
    if (request.admin) {
        return response.redirect("/");
    }

    next();
}


module.exports.loginRequired = loginRequired;
module.exports.logoutRequired = logoutRequired;