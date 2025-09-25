const express = require('express');
const server = express();
const mongoDB = require('./db/connect');
require('dotenv').config();

server.get('/', (req,res)=>{
  res.send("Hello world");
})

mongoDB(process.env.MONGO_URI);

const PORT = process.env.PORT;

server.listen(PORT, ()=>{
  console.log(`Server is listening on port ${PORT}`);
})