const fs = require("fs");

function parse(filePath,defaultArray = []){
    if(!fs.existsSync(filePath)) return defaultArray;
    let fileData = fs.readFileSync(filePath);
    try{
        return JSON.parse(fileData);
    }catch(err){
        return defaultArray;
    }
}

function serialize(filePath,object){
    try{
        const objectSerialized = JSON.stringify(object);
    fs.writeFileSync(filePath,objectSerialized);
    return true;
    }catch(err){
        return;
    }
    
}

module.exports = {parse,serialize};