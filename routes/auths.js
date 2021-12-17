var express = require("express");
var router = express.Router();

const { Users } = require("../model/users");
const userModel = new Users();

router.get('/x',function(req,res,next){
    const da = userModel.register("daniel","dotche");
   return res.json("hello");
})

router.post("/register",function(req,res,next){
    console.log("post /auths");
    if(
        !req.body ||
        (req.body.hasOwnProperty("username") && req.body.username.length==0) ||
        (req.body.hasOwnProperty("password") && req.body.password.length === 0)

    )
        return res.status(400).end();
    const authenticatedUser = userModel.register(
        req.body.username,
        req.body.password
    );

    if(!authenticatedUser) return res.status(409).end();

    return res.json(authenticatedUser);

});

router.post("/login",async function(req,res,next){
    console.log("demande de connection");

    if(
        !req.body ||
        (req.body.hasOwnProperty("username") && req.body.username.length==0) ||
        (req.body.hasOwnProperty("password") && req.body.password.length === 0)
    ) return res.status(400).end();
    console.log("demande au nom de : "+req.body.username);

    const utilisateurConnecte = await userModel.login(
        req.body.username,
        req.body.password
    );

    if(!utilisateurConnecte) return res.status(409).end();
    console.log(utilisateurConnecte);
    return res.json(utilisateurConnecte);
})

module.exports = router;