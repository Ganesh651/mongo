const express = require("express");
const path = require("path");
const cors = require("cors")

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
// initializing Express 
const app = express();
app.use(cors())
app.use(express.json());
const dbPath = path.join(__dirname, "user.db");
console.log(dbPath);
let db = null;


// app.get("/", (req,  res) => {
//   console.log("path matched")
//     res.send(`<h1 style="color:red; text-align:center">Hello World!!!</h1>`)
// })

// app.use((req, res, next) => {
//   console.log("Middleware")
//   res.status(404).send("404 - Not Found");
// });




const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    app.listen(5000, () => {
      console.log("Server Running")
    })
  }catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer();


app.post("/new-user", async (req, res) => {
  const { name, phone, email } = req.body
  const isUserExits = `select * from user where name = "${name}"`
  const dbResponse = await db.get(isUserExits)
  if (dbResponse === undefined) {
    const createUser = `INSERT INTO user (name,email,phone) VALUES ("${name}", "${email}", ${phone})`
    const dbResponse = await db.run(createUser)
    console.log(dbResponse)
    res.send("User added")
  } else {
    res.send("User Already Exits")
  }
});

app.get("/", async (req, res) => {
  const getUserDetails = `select * from user`
  const dbResponse = await db.all(getUserDetails)
  res.send(dbResponse)
});

app.use((req, res, next) => {
  res.send("404 Notfound")
});