var mongoClient = require("mongodb").MongoClient;

mongoClient.connect("mongodb://127.0.0.1:27017")
.then(clientObj=>{
    var database = clientObj.db("calendardb");
    var appointment = {
        Appointment_Id: 1,
        Title: "Farewell",
        Description: "Party at 9:30 PM",
        Date: new Date("2024-05-18"),
        UserId: "john_123"
    }
    database.collection("appointments").insertOne(appointment).then(()=>{
        console.log("Task Added Sucessfully...");
    })
})