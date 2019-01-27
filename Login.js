const express=require('express');
const bodyParser=require('body-parser');
const _ = require('lodash');
const jwt=require("jsonwebtoken")
//local import
const mongoose=require('./DB/connection');
const {user}=require('./Model/User');
const {createResponse}=require('./Model/response')
const {secretKey}=require('./constants/constant')
let {tokenList}=require('./constants/constant')
let {token}=require('./constants/constant')
const {tokenType}=require('./constants/constant')
// var localStorage = require('localStorage')
//Api
//Api set up 
var router=express.Router();
router.get('/Login',(req,res)=>{
    let username=req.body.userName;
    let password =req.body.password;
    login(username,password).then(result=>{
        return  res.header({token:result.result.token}).send(result);
    }).catch((err)=>{
        return  res.status(err.statusCode).send(err)
    })
})
//Login User and create token
let login=(username,password)=>{
    return new Promise((res,rej)=>{
        password=jwt.sign(password,secretKey);
        user.findOne().and([{password:password},{userName:username}]).then((result)=>{
          if(!result)
         {     
          let response=createResponse("User Does not exists !","User Does not exists !",404);      
          return  rej(response);
         }
         else
         {
          setRefreshToken(result._id).then(result=>{
          }).catch(err=>{
            let response=createResponse("Error occured!" ,{error:err},500);
            return rej(response);
          })
          token.Time=new Date();
          token.UserId=result._id;
          token.Name=tokenType[0];
          let jwtToken=jwt.sign(token,secretKey);
          tokenList.push(jwtToken);
          //localStorage.setItem('currentUserToken', result.jwtToken);
          let response=createResponse("Login Successfully!",{token:jwtToken},200);
          return res(response);
         }
      }).catch((err)=>{
          let response=createResponse("Error occured!" ,{error:err},500);
          return rej(response);
      })
      })
     }
//set RefreshToken
let setRefreshToken=(id)=>{
          token.Time=new Date();
          token.UserId=id;
          token.Name=tokenType[1];
          let refreshToken=jwt.sign(token,secretKey);
    return new Promise((reject,respons)=>{
        user.findOneAndUpdate({_id:id},{$set :{refreshToken:refreshToken}},{new : true}).then(result => {
        if(!result)
        {  
         return  reject(false);
        }
        else
        {
         return respons(true);
        }   
        })
        .catch( err => {
            return reject(false);
        })
    })
}   
/*end of api */ 
module.exports=router;