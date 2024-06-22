var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var cors = require('cors');
require('dotenv').config()


var port = 'process.env.MONGO_URL';
var app = express();
app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

//server side

app.post("/register-user" , (req, res)=>{
    var user = {
        UserId : req.body.UserId,
        UserName : req.body.UserName,
        Password : req.body.Password,
        Email : req.body.Email,
        Mobile : req.body.Mobile
    }

    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db('react-todo');
        database.collection('users').insertOne(user).then(()=>{

            res.end();
          
           
        } );
    });
});

app.get("/get-users" , (req, res)=>{
    

    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db('react-todo');
        database.collection("users").find({}).toArray().then((documents)=>{
            res.send(documents);
            res.end();
          
           
        } );
    });
});

app.post("/add-task" , (req, res)=>{
    var task = {
        Appointment_Id : parseInt(req.body.Appointment_Id , 10),
        Title : req.body.Title,
        Description : req.body.Description,
        Date : new Date(req.body.Date),
        UserId : req.body.UserId
    }

    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db('react-todo');
        database.collection('appointments').insertOne(task).then(()=>{

            console.log(`Task Added`);
            res.end();
          
           
        } );
    });
});

app.get("/view-tasks/:User_Id" , (req, res)=>{
    

    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db('react-todo');
        database.collection("appointments").find({UserId:req.params.User_Id}).toArray().then((documents)=>{
            res.send(documents);
            res.end();
          
           
        } );
    });
});

app.get("/view-task/:id" , (req, res)=>{
    
    var id = parseInt(req.params.id);

    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db('react-todo');
        database.collection("appointments").find({Appointment_Id:id}).toArray().then((documents)=>{
            res.send(documents);
            res.end();
          
           
        } );
    });
});



app.put("/edit-task/:id" , (req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db("react-todo");
        database.collection("appointments").updateOne({Appointment_Id:id},{$set : {  Appointment_Id : parseInt(req.body.Appointment_Id , 10), Title : req.body.Title,  Description : req.body.Description,  Date : new Date(req.body.Date),  UserId : req.body.UserId  }})
        .then(()=>{
            console.log('Task Updated');
            res.end();
        });
    });
});

app.delete("/delete-task/:id" ,(req, res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(port).then(clientObj=>{
        var database = clientObj.db("react-todo");
        database.collection('appointments').deleteOne({Appointment_Id:id})
        .then(()=>{
            console.log('Task Deleted');
            res.end();
       
        });
    });
});

app.listen(4000);
console.log('Server Started : http://localhost:4000')
