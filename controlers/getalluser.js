const userModel=require("../database/Schema")
const getalluser=async(req,res)=>{
  try{const alluser=await userModel.find()

  if(alluser.length!==0){
    res.status(200).json({success:true,message:"all users",data:alluser})
  }else(res.status(500).json({success:false,message:"something went wrong",data:null}))
  }
catch(e){console.error(e)}}
module.exports=getalluser