const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const encrypt = require('mongoose-encryption');
require('dotenv').config()

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);
// Don't touch the code above.

app.route("/")

.get(function(req,res){
    res.render("home");
})

app.route("/register")
.get(function(req,res){
    res.render("register");
})

.post(function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err){
        if (err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
})

app.route("/login")
.get(function(req,res){
    res.render("login");
})

.post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err,foundUser){
        if (!err){
            if (foundUser){
                if (foundUser.password === password){
                    res.render('secrets');
                }
            }
        } else {
            console.log(err);
        }
    })
})



// Code that we shouldn't touch :^)

app.listen(3000, function(){
    console.log("Server started...");
});