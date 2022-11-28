//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
// const { log } = require("console");

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

//===================================

//connecting to DataBase

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

//=====================================================================
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});  // after using moongoose.schema its now no longer the simple javaScript object
//its actually a moongose schema class

//encryption

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

//user model
const User = new mongoose.model("user",userSchema);


//============================================================
app.get('/',function(req,res){
    res.render("home");
})

app.get('/login',function(req,res){
    res.render("login");
})

app.get('/register',function(req,res){
    res.render("register");
})

app.post('/register',function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
});

app.post('/login',function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundname){
        if(err){
            console.log(err);
        }else{
            if(foundname){
                if(foundname.password === password){
                    res.render("secrets");
                }
            }
        }
    })
})




//===========================================================================
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}....`);
})
