var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var cors = require('cors');
require('dotenv').config();

var mongoUrl = process.env.MONGODB_URL; // Correctly assigning the URL from the environment variable
var app = express();
var port = process.env.PORT || 4000; // Use environment variable for port or default to 4000

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log(`Connecting to MongoDB at ${mongoUrl}`);

// Helper function to connect to MongoDB
const connectToDatabase = async () => {
    try {
        const client = await mongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        return client.db('react-todo');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        throw error;
    }
};

// Routes
app.post("/register-user", async (req, res) => {
    const user = {
        UserId: req.body.UserId,
        UserName: req.body.UserName,
        Password: req.body.Password,
        Email: req.body.Email,
        Mobile: req.body.Mobile
    };

    try {
        const database = await connectToDatabase();
        await database.collection('users').insertOne(user);
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.get("/get-users", async (req, res) => {
    try {
        const database = await connectToDatabase();
        const users = await database.collection("users").find({}).toArray();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send('Error fetching users');
    }
});

app.post("/add-task", async (req, res) => {
    const task = {
        Appointment_Id: parseInt(req.body.Appointment_Id, 10),
        Title: req.body.Title,
        Description: req.body.Description,
        Date: new Date(req.body.Date),
        UserId: req.body.UserId
    };

    try {
        const database = await connectToDatabase();
        await database.collection('appointments').insertOne(task);
        res.status(201).send('Task added successfully');
    } catch (error) {
        res.status(500).send('Error adding task');
    }
});

app.get("/view-tasks/:User_Id", async (req, res) => {
    try {
        const database = await connectToDatabase();
        const tasks = await database.collection("appointments").find({ UserId: req.params.User_Id }).toArray();
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send('Error fetching tasks');
    }
});

app.get("/view-task/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const database = await connectToDatabase();
        const task = await database.collection("appointments").findOne({ Appointment_Id: id });
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send('Error fetching task');
    }
});

app.put("/edit-task/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const database = await connectToDatabase();
        await database.collection("appointments").updateOne(
            { Appointment_Id: id },
            {
                $set: {
                    Appointment_Id: parseInt(req.body.Appointment_Id, 10),
                    Title: req.body.Title,
                    Description: req.body.Description,
                    Date: new Date(req.body.Date),
                    UserId: req.body.UserId
                }
            }
        );
        res.status(200).send('Task updated successfully');
    } catch (error) {
        res.status(500).send('Error updating task');
    }
});

app.delete("/delete-task/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const database = await connectToDatabase();
        await database.collection('appointments').deleteOne({ Appointment_Id: id });
        res.status(200).send('Task deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting task');
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
