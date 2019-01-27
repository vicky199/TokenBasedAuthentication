let mongoose=require('mongoose');
//model declaration
var employee=mongoose.model('Employee',{
  name:{
      type:String,
      required:true
  },
  salary:{
      type:Number,
      required:true
  }
});
//method
let addEmployee=(employeeObj)=>{
    employeeObj.save().then((res)=>{
         console.log(res);
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports={
    employee,addEmployee
}