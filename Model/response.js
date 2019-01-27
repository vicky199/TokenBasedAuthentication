let response={
    messege:String,
    result:JSON,
    statusCode:Number
};
let createResponse=(messege,result,statusCode)=>{
return  response={
    messege:messege,
    result:result,
    statusCode:statusCode
}
}
module.exports={response,createResponse};