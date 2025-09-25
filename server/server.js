const express = require('express');
const mongoDB = require('./db/connect');
const tasks = require('./routes/tasks');
require('dotenv').config();

const server = express();

//middleware
server.use(express.json());

//routes
server.use('/api/v1/tasks', tasks);

server.get('/', (req,res)=>{
  res.send("Hello world");
})

//start server
const start = async () => {
  try {
    await mongoDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const PORT = process.env.PORT;
    server.listen(PORT, ()=>{
      console.log(`Server is listening on port ${PORT}`);
    })
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

start();
