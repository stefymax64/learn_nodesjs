// console.log("Hello");

const bcrypt = require("bcrypt");
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
// const Sequelize = require("sequelize").Sequelize;

const databaseName = "apprendre";
const username = "admin";
const password = "password";
const host = "localhost";
const dialect = "mariadb";

const sequelize = new Sequelize(databaseName, username, password, {
    host : host,
    dialect : dialect
});

sequelize.define("User",{
    username : DataTypes.STRING,
    lastName : DataTypes.STRING,
    age : DataTypes.INTEGER,
    password : DataTypes.STRING,
    email : DataTypes.STRING
})
const User = sequelize.models.User;
// User.create({
//     name : "Clémentine",
//     lastName: "Cellier",
//     age : 28,
//     password : "clem",
//     email : "clementinecellier.pro@gmail.com"
// })

sequelize.sync();
// sequelize.sync({force : true});

const app = express();
const port = 4000;

app.use(express.json());

// app.get("/contact",(req, res)=>{
//     res.send("<h2>Page contact</h2>")
// })

// app.get("/",(req, res)=>{
//     res.sendFile("index.html",{
//         root : __dirname
//     })
// })

app.post("/user", async(req,res)=>{
    const user = req.body;
    await User.create({
        username : req.body.username,
        lastName: req.body.lastName,
        age : req.body.age,
        password : bcrypt.hashSync(req.body.password,10),
        email : req.body.email
    });
    res.json(user);
    // res.status(200).json([user, req.originalUrl, req.body, req.params]);
})

app.get("/login", async(req, res)=>{
    const User = sequelize.models.User; //je recupère la table User
    const token = null;
    // récupérer le mot de passe envoyé parle client
    const password = req.body.password;
    // comparer le mot de passe client avec le mot de passe BDD
    const user = await User.findOne({ // je cherche l'utilisateur par son prénom
        where : {username : req.body.username}
    })
    // dans les paramètres, 
    // 1er attribut password en clair que le client à entrer et 
    // 2eme attribut password hash récupérer dans la BDD
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if(isPasswordCorrect){
        res.status(200).json({message:"vous êtes identifié", data:token})
        return;
    }
    else{
        res.status(400).json({message:"wrong credentials", data:null})
    }
    
});

app.listen(port, function(){
    console.log("Serveur start at localhost", port)
})



// const pwd = "password";
// const hashPassword = bcrypt.hashSync(pwd,10)
// console.log(hashPassword);