var express = require('express');
var router = express.Router();

const { Films } = require("../model/films");
const { authorize } = require("../utils/authorize");
const filmModel = new Films();
/* GET users listing. */
router.get('/', function(req, res, next) {

  var data;
  if(req.query.duration){
    console.log(req.query.duration);
    data = filmModel.filter(req.query.duration);
  }else{
    data = filmModel.getAll();
  }
  return res.json(data);
});

router.get("/:id",function(req,res){
  console.log(`GET /films/${req.params.id}`);
  const film = filmModel.getOne(req.params.id);
  if(!film) return res.status(404).end();

  return res.json(film);
})

router.post('/',authorize,function(req,res){
  if(
    !req.body || 
    (req.body.hasOwnProperty("title") && req.body.title.length === 0) ||
    (req.body.hasOwnProperty("duration") && req.body.duration.length === 0)||
    (req.body.hasOwnProperty("budget")&& req.body.budget.length === 0) ||
    (req.body.hasOwnProperty("link") && req.body.link.length===0)
    )
    return res.status(400).end();
    const film = filmModel.addOne(req.body);
    return res.json(film);
});

router.delete("/:id",authorize, function (req, res) {
  console.log(`DELETE /films/${req.params.id}`);

  const film = filmModel.deleteOne(req.params.id);
  // Send an error code '404 Not Found' if the pizza was not found
  if (!film) return res.status(404).end();
  return res.json(film);
});


router.put("/:id",authorize, function (req, res) {
  console.log(`PUT /film/${req.params.id}`);
  // Send an error code '400 Bad request' if the body parameters are not valid
  if (
    !req.body || 
    (req.body.hasOwnProperty("title") && req.body.title.length === 0) ||
    (req.body.hasOwnProperty("duration") && req.body.duration.length === 0)||
    (req.body.hasOwnProperty("budget")&& req.body.budget.length === 0) ||
    (req.body.hasOwnProperty("link") && req.body.link.length===0)
  )
    return res.status(400).end();

  const film = filmModel.updateOne(req.params.id, req.body);
  // Send an error code 'Not Found' if the pizza was not found :
  if (!film) return res.status(404).end();
  return res.json(film);
});

module.exports = router;
