//imports
const mongoose=require('../DB/connection');
const jwt = require('jsonwebtoken')
const {secretKey}=require('../constants/constant')
let {tokenList}=require('../constants/constant')
let {token}=require('../constants/constant')
const {tokenType}=require('../constants/constant')
const {timeForAccessToken}=require('../constants/constant')
const {timeForRefreshToken}=require('../constants/constant')
const _ = require('lodash');
const {createResponse}=require('../Model/response')
const userModel=require('./User');
// var localStorage = require('localStorage')
//actual logic
module.exports = (req,res,next) => {
  const requestedToken = req.body.token || req.query.token || req.headers['token']
  if (requestedToken) {
      if(tokenList.includes(requestedToken))
      {
      token=jwt.verify(requestedToken,secretKey);
      let tokenDate=new Date(token.Time);
      let currentTime=new Date();
      //date diff provide value in miliseconds
      if((currentTime-tokenDate)/60000>timeForAccessToken)
      {
        setAccessTokenByRefreshToken(tokenList,requestedToken,token).then(result=>{
            req.currentUserToken = result.result;
            next();
        }).catch(err=>{
            return  res.status(err.statusCode).send(err)
        })
      }
      else
      {
        //localStorage.setItem('currentUserToken', requestedToken);
        req.currentUserToken = requestedToken;
        next();
      }     
    }
    else
    {
        return res.status(403).send({
            statusCode:403,
            error: "Invalid token provided.",
            message: 'Invalid token provided.'
        });
    }}
     else {
    return res.status(403).send({
        statusCode:403,
        error: "No token provided.",
        message: 'No token provided.'
    });
}
}
let setAccessTokenByRefreshToken=(tokenList,requestedToken,tokenProvide)=>{
    return new Promise((res,rej)=>{
    _.pull(tokenList,requestedToken);
    userModel.getUserById(tokenProvide.UserId).then(result=>{
     if(result)
     {
         var refreshToken=result.result.refreshToken;
         token=jwt.verify(refreshToken,secretKey);
         let refreshTokenTime=new Date(token.Time);
         currentTime=new Date();
         if((currentTime-refreshTokenTime)/60000>timeForRefreshToken)
         {
            let response=createResponse("Refresh token is Expired !","Unauthorized access !",403);  
            return rej(response);
         }

         token.Time=new Date();
         token.UserId=result.result._id;
         token.Name=tokenType[0];
         let jwtToken=jwt.sign(token,secretKey);
         tokenList.push(jwtToken);
         let response=createResponse("Token set Successfully!",jwtToken,200);  
         return res(response);
     }
     else
     {
        let response=createResponse("Refresh token does not exists !","Unauthorized access !",403);  
        return rej(response);
     }
    }).catch(err=>{
        let response=createResponse("Unauthorized access !","Unauthorized access !",403);  
        return rej(response);
    })
  })

}