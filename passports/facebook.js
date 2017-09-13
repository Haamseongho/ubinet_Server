/**
 * Created by haams on 2017-09-11.
 */
var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var expressSession = require("express-session");
var express = require("express");
var router = express.Router();


module.exports = function (router, passport) {
    passport.use(new FacebookStrategy({
            clientID: "1489945794382557",
            clientSecret: "28fd8417f74493346ccabb984224acdc",
            callbackURL: "/auth/facebook/callback"
        }, function (accessToken, refreshToken, profile, done) {
            console.log("facebook" + profile.toString());
            done(null, profile);
        }
    ));

    passport.serializeUser(function (user, done) {
        console.log("SerializeUser() 호출");
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        console.log("deserializeUser() 호출");
        done(null, user);
    });

    router.use(expressSession({
        secret: "ubinet111",
        resave: true,
        saveUninitialize: true
    }));
    router.use(passport.initialize());
    router.use(passport.session());

    router.get("/auth/facebook", passport.authenticate('facebook'));
    router.get("/auth/facebook/callback", passport.authenticate('facebook',
        {
            successRedirect: "/login_success",
            failureRedirect: "/login_fail"
        }));

    router.get("/login_success", ensureAuthenticated, function (req, res) {
        console.log("login success 호출");
        res.redirect("/main");
    });
    // 로그인 성공 시 /main 으로 redirection -- 라우터에서 해결 (get으로 넘어옴);

    router.get("/login_fail", function (req, res) {
        console.log("login fail");
        res.redirect("/");
    });

    // 로그인 실패 시 원래 있던 페이지로 다시 돌아오기

    router.get("/main", function (req, res) {
        console.log(req.user);
        if (Array.isArray(req.user)) {
            res.render("main.ejs", {user: req.user[0]._doc})
        } else {
            res.render("main.ejs", {user: req.user});
        }
    });


    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            console.log("인증 완료");
        } else {
            res.redirect("/");
            // 인증이 안될 경우 현 페이지 위치
        }
    }
};