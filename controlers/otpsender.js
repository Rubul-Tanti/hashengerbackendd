const nodemailer=require("nodemailer")

const otpSender=async(req,res,next)=>{
 try{ const usercontact=req.body
  console.log(usercontact)
  const otp=Math.floor( (Math.random()*parseInt(process.env.OTPALGO))+parseInt(process.env.DIGITALGO) )

  if(usercontact.type==="sms"&&usercontact.id){
    const number=parseInt(usercontact.id);
try{
 const accountSid =process.env.TWILLOSID;
  const authToken =process.env.TWILLOTOKEN;
  const client = require('twilio')(accountSid, authToken);
  try{

    const res=client.message.create({
      from: 'whatsapp:+14155238886',
      contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
      contentVariables: `{"1":"${otp}"}`,
      to: `whatsapp:+91${number}`
    })
    req.userInfo={otp:otp,log:usercontact.id}
    
    next()
  }catch(e){res.status(200).json({success:false})
console.error(e)}
}
catch(e){console.error(e)}
  }
  else if(usercontact.type==="email"&&usercontact.id){
    try{

      const auth=nodemailer.createTransport({
        service:"gmail",
        port:"465",
        secure:false,
        auth:{
          user:"hashenger@gmail.com"
          , pass:"svtp tusp prny gbin"
        }
      })
      const reciver={
        from:"hashenger@gmail.com",
        to:`${usercontact.id}`,
        subject:"Email verification",
        text:`${otp} is your verification code.for security reasons do not share this code`
      }
      await auth.sendMail(reciver,(error,responce)=>{
        console.log(responce)
        if(error){
          console.log(error)
        }})
      req.userInfo={log:usercontact.id,otp:otp} 
      next()
    }catch(e){console.error(e)}
  }else{
    res.status(200).json({success:false,messages:"something went wrong"})
  }}
  catch(e){console.error(e)}
  }
  module.exports=otpSender