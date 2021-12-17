
const {parse,serialize} = require('../utils/json');
const jwt = require("jsonwebtoken");
const jwtSecret = "ilovefilms";
const bcrypt = require("bcrypt");
const jsonDbPath = __dirname + "/../data/users.json";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; 

const defaultItems = [
    {
        username: "admin",
        password:"admin",
        role:"admin"
    },
];
class Users{
    constructor(dbPath = jsonDbPath,items = defaultItems){
        this.jsonDbPath = dbPath;
        this.defaultItems = items;
    }

    getNextId() {
        const items = parse(this.jsonDbPath, this.defaultItems);
        let nextId;
        if (items.length === 0) nextId = 1;
        else nextId = items[items.length - 1].id + 1;
    
        return nextId;
      }
    getAll() {
        const items = parse(this.jsonDbPath, this.defaultItems);
        return items;
      }
    getOne(id){
        const items = parse(this.jsonDbPath,this.defaultItems);
        const foundIndex = items.findIndex((item)=>item.username == id);
        if(foundIndex < 0) return;
        return items[foundIndex];

    }
    getOneByUsername(username){
        
        const items = parse(this.jsonDbPath);
        const foundIndex = items.findIndex((item) => item.username== username);
        if(foundIndex < 0) return;

        return items[foundIndex];
    }
    async addOne(body){
        const items = parse(this.jsonDbPath,this.defaultItems);
        let passwordHash = await bcrypt.hash(body.password,10);
        const newItem = {
            username:body.username,
            password:passwordHash,
            role:"utilisateur"
        };

        items.push(newItem);
        serialize(this.jsonDbPath,items);
        return newItem;
    }
    register(username,password){
        const userFound = this.getOneByUsername(username);
        if(userFound) return;

        const newUser = this.addOne({username:username,password:password});

        const authenticatedUser = {
            username: username,
            token:"Future signed token",
        };

        const token = jwt.sign({username:authenticatedUser.username},jwtSecret,{expiresIn: LIFETIME_JWT});
        authenticatedUser.token = token;

        return authenticatedUser;
    }
    async updateOne(username,body){
       
        let otherUser = this.getOneByUsername(body.username);
        if(otherUser) return;
        body.password = await bcrypt.hash(body.password,10);
        let allUsers = parse(jsonDbPath);
        let foundIndex = allUsers.findIndex((user)=> user.username==username);
        
        let updateUser = {...allUsers[foundIndex],...body};

        allUsers[foundIndex] = updateUser;
        console.log(updateUser);

        serialize(jsonDbPath,allUsers);

        return updateUser;

        // user is updated now relogin
        
        

    }
    async login(username,password){
        const utilisateur = this.getOneByUsername(username);
       
        if(!utilisateur) return;
        
        const match = await bcrypt.compare(password, utilisateur.password)
        if(!match) return;

        const utilisateurConnecte = {
            username: username,
            token:"future signed token",
        }
        const token = jwt.sign({username:utilisateur.username},jwtSecret,{expiresIn:LIFETIME_JWT});

        utilisateurConnecte.token = token;
        return utilisateurConnecte;
       

    }

}

module.exports = { Users }; 