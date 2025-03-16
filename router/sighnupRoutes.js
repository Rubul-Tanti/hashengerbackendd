const express =require("express");
const upload=require("../middleware/imageuploadMiddle")
const getalluser=require("../controlers/getalluser")
const otpSender=require("../controlers/otpsender")

const uploadToCloudinary=require("../middleware/coudinary/helper")
const fs=require("fs")
const UserModel=require("../database/Schema");

let Currotp=""
let log=""
const router=express.Router()
router.post("/signup",otpSender,(req,res)=>{
 try{
   Currotp=req.userInfo.otp
  
   log=req.userInfo.log
   
   res.status(200).json({
  success:"true",
  message:"otp sent"
})
}catch(e){console.error(e)}
})

router.post("/signup/otpverify",async(req,res)=>{
  try{
    const {otp}=req.body
    
    if(Currotp===parseInt(otp)){
      const alreadyexits=await UserModel.find({log})

      if(alreadyexits.length===1)
      {
        res.status(500).json({success:true,alreadyexits:true,message:"user already exists",data:alreadyexits[0]})
      }
      else{res.status(201).json({success:true,alreadyexits:false,message:"verified"})
    }
    }else{res.status(500).json({success:false,message:"otp does not match"})}
  }catch{(e)=>{console.error(e)}}
  
  })
  
router.post("/signup/createprofile", upload.single("image"),async(req,res)=>{
 
  const {url} =await uploadToCloudinary(req)
  try{
  if(url){
    const {username,bio,gender}=req.body
      if(username,bio){
        const newUser=await UserModel.create({username:username,bio:bio,imageUrl:url,gender:gender,log:log})
        if(newUser){
       
          res.status(200).json({success:true,message:"profile created",data:newUser})
          fs.unlinkSync(req.file.path)
        }else{res.status(500).json({success:false,message:"something went wrong"})}
      }
    }else{
      res.send(500).json({success:fasle,message:"something went wrong try again"})
    }
  }catch(e){console.error(e)
    res.status(200).json({success:false,message:"something went wrong"})
  }
  })

router.get("/getalluser",getalluser)

router.post("/chatrequest/:id",async(req,res)=>{
try{

  const sender=await UserModel.findById(req.body.sender)
  const reciver=await UserModel.findById(req.params.id)
  if(req.body.sender===req.params.id){
    res.status(200).json({success:false})
  }else{

    if(!sender&&!reciver){
      res.status(500).json({success:false,message:"something went wrong"})
    } 
    if(reciver.friendrequest.includes(sender._id)||reciver.friends.includes(sender._id)){
      res.status(501).json({success:false,message:"all ready sent request"})
    }
    else{
      
      const a =await reciver.friendrequest.push(sender._id)
      await reciver.save()
      if(a){
        res.status(500).json({success:true,message:"sent request"})
      }
    }
  }
}
  catch(e){console.error(e)}
})
router.post("/getrequestlist",async(req,res)=>{
  try{
    const user=req.body.userid
    const userindb=await UserModel.findById(user)

if(!userindb){
res.status(200).json({success:false,message:"something went wrong"})
}
const requestlist=userindb.friendrequest
if(requestlist.length===0){
  res.status(404).json({success:true,message:"no request found"})
}else{

  
  let requestlistdata=[];
  async function push(params) {
    await Promise.all(requestlist.map(async(id)=>{
      const senderuser= await UserModel.findById(id);
      requestlistdata.push(senderuser)
    }))
    res.status(500).json({success:true,message:"this are the requests",data:requestlistdata})
  }
  push()
}
}catch(e){console.error(e)}
})

router.post("/acceptrequest/:id",async(req,res)=>{
  try{
    const reciever=req.params.id
    const sender=req.body.sender
    const index=req.body.index
    const reciverindex=index;
    const recieverdata =await UserModel.findById(reciever)
    const senderdata =await UserModel.findById(sender)
    if(senderdata.friendrequest.includes(reciever)){
      await senderdata.friends.push(reciever)
      await senderdata.friendrequest.splice(reciverindex,1)
      await recieverdata.friends.push(sender)
      await  recieverdata.save()
     await senderdata.save()
      if(recieverdata.friendrequest.includes(sender)){
       const newarr= await recieverdata.friendrequest.filter(x=>x!==sender) 
       await UserModel.findByIdAndUpdate({friendrequest:newarr})
      }
      res.status(500).json({success:true,message:"request acepted"})
    }
  }catch(e){console.error(e)}})

router.get("/getallfriends/:id",async(req,res)=>{

  try{const allfriends=await UserModel.findById(req.params.id)
  if(allfriends.length!==0){
     
  let friendslistdata=[];
  async function push(params) {
    await Promise.all(allfriends.friends.map(async(id)=>{
      const user= await UserModel.findById(id);
      friendslistdata.push(user)
    }))
    res.status(500).json({success:true,message:"this are the friends",data:friendslistdata})
  }
  push()
  }else(res.status(500).json({success:false,message:"something went wrong",data:null}))
  }
catch(e){console.error(e)}})

module.exports=router