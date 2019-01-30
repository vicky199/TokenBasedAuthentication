//exports
const mongoose=require('./DB/connection');
const express=require('express');
const bodyParser=require('body-parser');
var login = require('./Login');
var user = require('./User');
let {tokenList}=require('./constants/constant')
//end 
var app = express();
app.use(bodyParser.json());
//token cheking
app.use('/login',login)
app.use(require('./Model/tokenChecker'))
app.use('/User',user)
app.get('/logout',(req,res)=>{
tokenList.pop(req.currentUserToken);
return res.status(200).send({message:"Logout successfully!" ,Result:"Logout successfully!",statusCode:200});
})
app.listen(3000,()=>{
    console.log('App running on 3000')
})