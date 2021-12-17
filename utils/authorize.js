const jwt = require("jsonwebtoken");

const jwtSecret = "ilovefilms";

const {Users} = require('../model/users');
const userModel = new Users();

const authorize = (req,res,next)=>{
    let token = req.get("Authorization");
    console.log(token);
    
    if(!token) return res.status(401).end();

    try{
        
        const decode = jwt.verify(token,jwtSecret);
        const userFound = userModel.getOneByUsername(decode.username);
        // user not found
        if(!userFound) return res.status(403).end();
        req.user = userFound;
        next();
    }catch(err){
        console.error("autorize",err);
        return res.status(403).end();
    }
};

const verifyRole = (req,res,next)=>{
    if(req.user.role!=="admin") return res.status(403).end();
    next();
}

module.exports = {authorize,verifyRole};
