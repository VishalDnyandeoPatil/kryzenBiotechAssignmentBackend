const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.port;
const {connection}= require('./config/db');
const{userRoutes}= require('./routes/userRoute')
const cors= require('cors');
const formDataRoutes= require('./routes/formData')


app.use(cors());
app.use(express.json());
 
app.get('/', (req, res) => {
  res.send('Hello from Kryzen Backend!');
});

app.use('/uploads', express.static('uploads'));
 
app.use('/api/users',userRoutes);
app.use('/api/form', formDataRoutes);


app.listen(port, async() => {
  try {
    await connection
    console.log("Kryzen App connected to DB") 
  } 
  catch (error) {
    console.log(error.message);
  }
});
