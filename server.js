import express from 'express';
import Pusher from 'pusher';
import mongoose  from 'mongoose';
import Messages from './dbMessages.js';
const app = express()
const port = 5000



const db = mongoose.connection;
db.once("open", () => {
    console.log("DB connected")
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on("change", (change) => {
        console.log("A Change occured", change);
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted",{
                
               name: messageDetails.name,
                message: messageDetails.message, 
                timestamp: messageDetails.timestamp

            });
            
        }else{
            console.log("Error Triggering pusher");
        }
    });
});






app.use(express.json());
const pusher = new Pusher({
    appId: "1115633",
    key: "cb7eddf3c50397b9a90d",
    secret: "363d07bd0c2aafa6e086",
    cluster: "eu",
    useTLS: true
  });
  



const connection_url = "mongodb+srv://TeamProject:WbTEM9stvfpEOs5O@cluster0.dbj4i.mongodb.net/messagecontents?retryWrites=true&w=majority";
mongoose.connect(connection_url,{
    useNewUrlParser: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
   

})
app.get('/messages/sync',(req, res) => {
    Messages.find((err, data) =>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(data)
        }
    })
})
   
app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
        
    })
})






app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})