var express = require('express');
var router = express.Router();
const { authorize,verifyRole } = require("../utils/authorize");
const { Users } = require("../model/users");
const { use } = require('.');
const userModel = new Users();

/* GET home page. */
router.get('/',authorize,verifyRole,function(req, res, next) {
  res.json(userModel.getAll());
});

router.put('/:username',authorize,async function(req,res,next){
    // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body || 
    (req.body.hasOwnProperty("username") && req.body.username.length === 0) ||
    (req.body.hasOwnProperty("password") && req.body.password.length === 0)||
    (req.body.hasOwnProperty("role")&& req.body.role.length === 0)
    
  )
    return res.status(400).end();
    
    let ok = await userModel.updateOne(req.params.username,req.body);
    // 
    if(!ok) return res.status(404).end()

    res.json(ok);
    
})
module.exports = router;