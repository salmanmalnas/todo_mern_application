var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");

var conStr = "mongodb://127.0.0.1:27017";

var app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.get("/get-users", (req, res)=>{
    mongoClient.connect(conStr).then(clientObj=>{

        var database = clientObj.db("calendardb");
        database.collection("users").find({}).toArray().then(documents=>{
            
            const modifiedDocuments = documents.map(doc => ({
                _id: doc._id.toString(),
                UserId: doc.UserId,
                UserName: doc.UserName,
                Password: doc.Password,
                Email: doc.Email,
                Mobile: doc.Mobile
            }));
            res.json(modifiedDocuments);
        }).catch(error => {
            console.error("Error in fetching users:", error);
            res.status(500).send("Error fetching users");
        }).catch(error => {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send("Error connecting to database");
        }).catch(error => {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send("Error connecting to database");
        });
    });
});


app.get("/get-appointments/:userid", (req, res)=>{
    mongoClient.connect.apply(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        database.collection("appointment").find({UserId:req.params.userid})
        .toArray().then(documents=>{
            res.send(documents);
            res.end();
        });
    });
});

app.listen(4400);
console.log("Server Started : http://127.0.0.1:4400");