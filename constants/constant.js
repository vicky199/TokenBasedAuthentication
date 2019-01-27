const secretKey='vickyplease';
const timeForAccessToken=1;
const timeForRefreshToken=2;
let token={
    UserId:String,
    Time:String,
    Name:String
}
let currentUserToken="";
const tokenType=["Access","Refresh"]  
let tokenList=[];
module.exports={secretKey,tokenList,token,timeForAccessToken,timeForRefreshToken,tokenType,currentUserToken};
