const cloudinary=require("cloudinary").v2
const cloudinaryConfig=async()=>{await cloudinary.config({ 
  cloud_name: process.env.CLOUDINARYCLOUDNAME, 
  api_key:process.env.CLOUDINARYAPIKEY, 
  api_secret:process.env.CLOUDINARYAPISECRET  // Click 'View API Keys' above to copy your API secret
});}
module.exports=cloudinaryConfig