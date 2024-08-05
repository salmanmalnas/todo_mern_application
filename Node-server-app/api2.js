var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");

var conStr = "mongodb://127.0.0.1:27017";

var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/get-users", (req, res) => {
    mongoClient.connect(conStr).then(client => {
        var database = client.db("calendardb");
        database.collection("users").find({}).toArray().then(documents => {
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
        }).finally(() => client.close()); // Ensure to close connection after response
    }).catch(error => {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send("Error connecting to database");
    });
});

app.get("/get-appointments/:userid", (req, res) => {
    mongoClient.connect(conStr).then(client => {
        var database = client.db("calendardb");
        database.collection("appointments").find({UserId: req.params.userid})
        .toArray().then(documents => {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(documents, null, 2)); 
        }).catch(error => {
            console.error("Error fetching appointments:", error);
            res.status(500).send("Error fetching appointments");
        }).finally(() => client.close());
    }).catch(error => {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send("Error connecting to database");
    });
});

app.get("/appointments/:id", (req, res) => {
    mongoClient.connect(conStr).then(client => {
        var database = client.db("calendardb");
        database.collection("appointments").find({Appointment_Id: parseInt(req.params.id)})
        .toArray().then(documents => {
            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify(documents, null, 2)); 
        }).catch(error => {
            console.error("Error fetching appointments:", error);
            res.status(500).send("Error fetching appointments");
        }).finally(() => client.close());
    }).catch(error => {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).send("Error connecting to database");
    });
});


app.post("/register-user", (req, res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        var user = {
            UserId: req.body.UserId,
            UserName: req.body.UserName,
            Password: req.body.Password,
            Email: req.body.Email,
            Mobile: req.body.Mobile
        };
        database.collection("users").insertOne(user).then(()=>{
            console.log("user Registered...");
            res.end();
        
        });
    });
});

app.post("/add-task", (req, res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        var appointment = {
            Appointment_Id: parseInt(req.body.Appointment_Id),
            Title: req.body.Title,
            Description: req.body.Description,
            Date: new Date(req.body.Date),
            UserId: req.body.UserId
        };
        database.collection("appointments").insertOne(appointment).then(()=>{
            console.log("Task Added Sucesfully...");
            res.end();
        
        });
    });
});

app.put("/edit-task/:id", (req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        var appointment = {
            Appointment_Id: parseInt(id),
            Title: req.body.Title,
            Description: req.body.Description,
            Date: new Date(req.body.Date),
            UserId: req.body.UserId
        };
        database.collection("appointments").updateOne({Appointment_Id:id},{$set:appointment})
        .then(()=>{
            console.log("Task Updated Sucesfully...");
            res.end();
        
        });
    });
}); 

app.delete("/delete-task/:id", (req,res)=>{
    mongoClient.connect(conStr).then(clientObj=>{
        var database = clientObj.db("calendardb");
        database.collection("appointments").deleteOne({Appointment_Id:parseInt(req.params.id)})
        .then(()=>{
            console.log("Task Delete Sucesfully...");
            res.end();
        
        });
    });
})

app.listen(6600, () => {
    console.log("Server Started : http://127.0.0.1:6600");
});
