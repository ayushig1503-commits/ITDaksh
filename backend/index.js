const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// CRITICAL FIX: Load environment variables BEFORE importing routes or using process.env
dotenv.config();

const Routes = require("./routes/route.js")
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '10mb' }))
app.use(cors())

// CLEANUP: Removed deprecated connection options & wrapped log in an arrow function
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

// Debugging block to list routes (Safe to keep or delete)
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log("Route Found:", r.route.path);
  } else if (r.name === 'router' && r.handle.stack){
    r.handle.stack.forEach(function(r){
      if(r.route && r.route.path){
        console.log("Route Found:", r.route.path);
      }
    });
  }
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})