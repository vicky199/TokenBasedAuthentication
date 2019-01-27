const mongoose=require('mongoose');
const validator=require('validator');
const {ObjectID}=require('mongodb');
const _ = require('lodash');
const {createResponse}=require('./response')
//model declaration
var userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:4
    },
    username:{
        type:String,
        required:true,
        unique: true,
        trim:true,
        minlength:4,
        validate:{
            validator:validator.isEmail,
            message:`{VALUE} is not an email.`
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        trim:true        
    },
    refreshToken:{
        type:String
    }
  })
  //overriding method
//   userSchema.methods.toJSON=function()
//   {
//      let user=this;
//      let userObject=user.toObject();
//      return _.pick(userObject,['name','userName']);
//   }
var user=mongoose.model('User',userSchema);
//Post methods
let addUser=(name,username,password)=>{
    return new Promise((res,rej)=>{
    let newUser=new user({
        name:name,
        username:username,
        password:password
   });
  
   newUser.save().then((result)=>{
    let response=createResponse("Added Successfully!",result,200);
    return res(response)
 }).catch((err)=>{
    let response=createResponse("Error occured!" ,{error:err.message},500);
    return rej(response)
})
});
}
//getall method
let getUser=()=>{
 return new Promise((res,rej)=>{
   user.find().then((result)=>{
       if(!result)
       {        
           
        let response=createResponse("No record found!","No record found!",404);      
        return  rej(response);
       }
       else
       {
        
        let response=createResponse("Fetched Successfully!",result,200);
        return res(response);
       }
   }).catch((err)=>{
    let response=createResponse("Error occured!" ,{error:err},500);
    return rej(response);
   })
 })
}

//get single object method
let getSingleUser=(userObject)=>{
    return new Promise((res,rej)=>{
      user.findOne().or([{name:userObject.name},{username:userObject.username}],{password:userObject.password}).then((result)=>{
        if(!result)
       {        
           
        let response=createResponse("No record found!","No record found!",404);      
        return  rej(response);
       }
       else
       {
        let response=createResponse("Fetched Successfully!",result,200);
        return res(response);
       }
    }).catch((err)=>{
        let response=createResponse("Error occured!" ,{error:err},500);
     return rej(response);
    })
    })
   }

   //get single by ID object method
let getUserById=(id)=>{
    return new Promise((res,rej)=>{
        if(!ObjectID.isValid(id)){
        let response=createResponse('Incorrect Id!',id,400);    
        return  rej(response);
        }
      user.findById(id).then((result)=>{
        if(!result)
       {  
        let response=createResponse("No record found!","No record found!",404);      
        return  rej(response);
       }
       else
       {
        let response=createResponse("Fetched Successfully!",result,200);
        return res(response);
       }
    }).catch((err)=>{
        let response=createResponse("Error occured!" ,{error:err},500);
     return rej(response);
    })
    })
   }

//delete many
let deleteUser=(userObject)=>{
    return new Promise((res,rej)=>{
       user.deleteMany().or([{name:userObject.name},{username:userObject.username}]).then((result)=>{
           if(result.n!=0)
           {
            let response=createResponse("Delete Successfully!",result,200);
            return res(response);
            }
            let response=createResponse("No record found!","No record found!",404); 
            return rej(response);
        }).catch(err=>{
            let response=createResponse("Error occured!" ,{error:err},500);
        return rej(response);
          })
    })
}
//delete one record
let deleteSingleUser=(userObject)=>{
    return new Promise((res,rej)=>{
       user.findOneAndDelete().or([{name:userObject.name},{username:userObject.username}]).then((result)=>{
        if(!result)
        {   
         let response=createResponse("No record found!","No record found!",404);      
         return  rej(response);
        }
        else
        {
         let response=createResponse("Delete Successfully!",result,200);
         return res(response);
        }
        }).catch(err=>{
        let response=createResponse("Error occured!" ,{error:err},500);
        return rej(response);
          })
    })
}
//delete by Id
let deleteUserById=(id)=>{
    return new Promise((res,rej)=>{
        if(!ObjectID.isValid(id)){
            let response=createResponse('Incorrect Id!','Incorrect Id!',400);          
            return  rej(response);
            }
       user.findByIdAndDelete(id).then(result=>{
        if(!result)
        {   
         let response=createResponse("No record found!","No record found!",404);      
         return  rej(response);
        }
        else
        {
         let response=createResponse("Delete Successfully!",result,200);
         return res(response);
        }
       }).catch(err=>{
        let response=createResponse("Error occured!" ,{error:err},500);
        return rej(response);
       })
    })
}
   // update methods
let updateUser=(userObj)=>{
    return new Promise((reject,respons)=>{
        user.findOneAndUpdate({_id:userObj.id},{$set :{password:userObj.password}},{new : true}).then(result => {
        if(!result)
        {   
         let response=createResponse("No record found!","No record found!",404);  
         return  reject(response);
        }
        else
        {
         let response=createResponse("Updated Successfully!",result,200);
         return respons(response);
        }   
        })
        .catch( err => {
            let response=createResponse("Error occured!" ,{error:err},500);
            return reject(response);
        })
    })
}   

  module.exports={user,addUser,getUser,getSingleUser,getUserById,deleteUser,deleteSingleUser,deleteUserById,updateUser};