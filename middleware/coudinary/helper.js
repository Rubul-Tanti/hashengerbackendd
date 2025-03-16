const cloudinary=require("cloudinary").v2
const env=require("dotenv")
env.config()

const cloudinaryConfig=require("./config")
cloudinaryConfig()
const uploadToCloudinary=async(req)=>{
  try{
    return await cloudinary.uploader.upload(req.file.path,{public_id:req.body.username})

  }
  catch(e){console.error("cant upload to  cloudinary",e)}
  }
module.exports=uploadToCloudinary
