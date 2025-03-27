const express =require( "express")
const env  =require( "dotenv")
const cors =require("cors")
const {Server} =require("socket.io")
const http =require( "http")
const connectToDatabase =require("./database/mongodb.js")
const router =require("./router/sighnupRoutes.js")
const { array } = require("./middleware/imageuploadMiddle.js")

env.config()
connectToDatabase()
const app=express()
app.get("/",(req,res)=>{res.send("hi")})
app.use(cors())
app.use(express.json({limit:"50mb"}))
app.use("/user",router)
let allusers=[]
let onlineusers=[]
const server=http.createServer(app)
const io= new Server(server, { cors: {
  origin:process.env.FRONTENDURL, // Allow React frontend
  methods: ["GET", "POST"],
}})
io.on("connection",(socket)=>{
console.log("connected")
  let id=socket.handshake.query.userid
  if(!onlineusers.includes(id)){
    allusers.push({userid:id,socketid:socket.id})
  onlineusers.push(id)
  }

io.emit("onlineusers",onlineusers)
socket.on("privatemessage",(recieverid,senderid,message)=>{
  
  let recieversocketid;
  let sendersocketid;

  let c=0
  allusers.map((user,i)=>{
if(    user.userid===recieverid){
  c++
   recieversocketid=user.socketid;
}
if(user.userid===senderid){
  c++
  sendersocketid=user.socketid
}
if(c===2){return}

})
io.to(recieversocketid).emit("privatemessage",{senderid,message})
})


socket.on("disconnect",(socket)=>{

  allusers.map((user,i)=>{
  if(user.socketid===socket.id){

    allusers.splice(i,1)
   onlineusers.splice(i,1)
   io.emit("onlineusers",onlineusers)
    return
  }
})
})
})

server.listen(process.env.PORT)
