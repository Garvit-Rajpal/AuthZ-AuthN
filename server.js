// instantiating the backend server
const express= require("express");
const app =express();
const cookieParser=require("cookie-parser");
// setting up the env file config loading
require("dotenv").config();

// Setting up the port for the backend
const PORT=process.env.PORT||3000;

// using cookie parser middleware
app.use(cookieParser());
//adding middleware json parser
app.use(express.json());

const routes=require("./routes/user");

// mount API routes

app.use("/api/v1",routes);


// start server

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})

//  connect to database;
const dbConnect=require("./config/database");
dbConnect();

app.get("/", (req,res)=>{
    res.send(`<h1>This is the First page of backend</h1>`);
})

