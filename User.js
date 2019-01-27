const express=require('express');
const _ = require('lodash');
const {SHA256}=require("crypto-js")
const jwt=require("jsonwebtoken")
//local import
const mongoose=require('./DB/connection');
const userModel=require('./Model/User');
const {secretKey}=require('./constants/constant')
//Api set up 
var router=express.Router();
// var localStorage = require('localStorage')
let currentUserToken="";//localStorage.getItem('currentUserToken');
//middleware
//setting current token
router.use((req, res, next)=>{
    currentUserToken=req.currentUserToken;
    next();
})
// add post 
router.post('/addUser',(req,res)=>{
    let name=req.body.name;
    let username=req.body.username;
    let password =req.body.password;
      //password=SHA256(password+secretKey).toString();
      userModel.addUser(name,username,password).then((result)=>{
        return  res.header({token:currentUserToken}).send(result);
    }).catch((err)=>{
        return  res.header({token:currentUserToken}).status(err.statusCode).send(err)
    })
   
});
//get user get request
router.get('/getUser',(req,res)=>{
    userModel.getUser().then((result)=>{
        return  res.header({token:currentUserToken}).send(result);
    }).catch((err)=>{
        return  res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
});
//get user single get request
router.get('/getSingleUser',(req,res)=>{
    let userObj={
        name:req.body.name,
        username:req.body.username
    }
    userModel.getSingleUser(userObj).then((result)=>{
        return  res.header({token:currentUserToken}).send(result);
    }).catch((err)=>{
        return  res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
});
//get user by Id get request
router.get('/getUserById/:id',(req,res)=>{
    let id=req.params.id;
    userModel.getUserById(id).then((result)=>{
        return res.header({token:currentUserToken}).send(result);
    }).catch((err)=>{
        return  res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
});
//delete all 
router.delete('/deleteUser',(req,res)=>{
    let userObj={
        name:req.body.name,
        username:req.body.username
    }
    userModel.deleteUser(userObj).then((result)=>{
        return res.header({token:currentUserToken}).send(result);
    }).catch(err=>{
        return res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
})
//delete singleUser  
router.delete('/deleteSingleUser',(req,res)=>{
    let userObj={
        name:req.body.name,
        username:req.body.username
    }
    userModel.deleteSingleUser(userObj).then((result)=>{
        return res.header({token:currentUserToken}).send(result);
    }).catch(err=>{
        return res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
})
//deleteById method
router.delete('/deleteUserById',(req,res)=>{
    let id=req.body.id;
    userModel.deleteUserById(id).then((result)=>{
        return res.header({token:currentUserToken}).send(result);
    }).catch(err=>{
        return res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
})
//update user
router.patch('/updateUser',(req,res)=>{
   let userOBJ={
     name:req.body.name,
     username:req.body.username,
     password:req.body.password,
     id:req.body.id
   };
   //userOBJ.password=SHA256(userObj.password+secretKey);
   userOBJ.password=jwt.sign(userOBJ.password,secretKey);
   //return res.send(updateUser(userOBJ));
   userModel.updateUser(userOBJ).then((result)=>{
        return res.header({token:currentUserToken}).send(result);
    }).catch(err=>{
        return res.header({token:currentUserToken}).status(err.statusCode).send(err);
    })
})
//
/*end of api */ 
module.exports=router;