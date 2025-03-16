const mongoose=require("mongoose")
const connectToDatabase=async()=>{
  try{ await mongoose.connect(process.env.MONGOURL,)
  }
  catch(e){console.error("cannot connect to db",e)
    return;
  }
}
module.exports=connectToDatabase