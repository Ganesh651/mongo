const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json())
const port = 3005;


const uri = "mongodb+srv://ganesh:gajarlaganesh@assignment.gsr9y2x.mongodb.net/?retryWrites=true&w=majority";
const dbName = "nxttrendz";

const client = new MongoClient(uri);

const connectToMongoDB = async ()=> {
  try {
    await client.connect(); 
    console.log("Connected to MongoDB");
    const db = client.db(dbName); 
    app.get("/users", async (req, res) => {
      try {
        const users = await db.collection("user").find().toArray()
        res.send(users);
      } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    
    // create user API 
    app.post("/create-user", async (req, res) => {
      const { name, score, matchType, year, noOfFours, noOfSixes } = req.body
      const newUser = {
        name,
        score,
        matchType,
        year,
        noOfFours,
        noOfSixes
      }
      try {
        await db.collection("user").insertOne(newUser)
        res.status(200).send("User created")
      } catch (err) {
        console.log(err)
      }
    })

    // Delete user API 
    app.delete("/delete-user/:id", async (req, res) => {
      const { id } = req.params
      console.log(id)
      try {
        const deletedUser = await db.collection("user").deleteOne({ _id: id }, 1)
        console.log(deletedUser)
        res.status(200).send("User Removed")
      } catch (err) {
        console.log(err)
      }
    })

    // Get user API 
    app.get("/user/:id", async (req, res) => {
      const { id } = req.params
      console.log(id)
      try {
        const user = await db.collection("user").findOne({ _id: id })
        console.log(user)
        if (user) {
          res.status(200).send(user)
        } else {
          res.status(404).send("User not exits")
        }
        
      } catch (err) {
        console.log(err)
      }
    })

    app.use((req, res, next) => {
      res.status(404).send("404 - Notfound")
    })

    app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error}`);
  }
}

connectToMongoDB();
