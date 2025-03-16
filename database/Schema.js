const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
  username:{require,type:String,unique:true}
  ,bio:{type:String,maxLength:[150,"bio cannot be more than 150 letters"],require}
  ,imageUrl:{type:String,require},
  gender:{type:String},
  log:{type:String}
  ,notification:[],
  joined:{type:Date},
  friends:[{type:String,}],
  friendrequest:[{type:String,}],
  backgroundimage:{type:String}
  
})

const UserModel=mongoose.model("user",userSchema)
// async function c(){
//   const q =await UserModel.findById('67d326dba43bfb0f589b8bbb')
//  const a= await UserModel.findById('67d297fe5711636083c7d36f')
//   const b=q.friends.splice(0,1)
// q.save()
// console.log(b)
// }
// c()


module.exports= UserModel