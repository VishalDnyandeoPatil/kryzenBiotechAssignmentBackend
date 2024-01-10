const mongoose = require('mongoose');
require('dotenv').config();
mongoose.set('strictQuery',true);

const connection = mongoose.connect(process.env.database_Url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to DataBase'))
.catch(error => console.error('Error connecting to DataBase:', error));

module.exports={
    connection
}
