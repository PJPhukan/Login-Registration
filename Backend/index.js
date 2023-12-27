const express=require('express')
const MongoToConnect=require('./db')
const cors=require('cors')

//Connection with database
MongoToConnect();

const app=express();
const port = 5000;

//middleware
app.use(express.json());
app.use(cors());

//Availble routes
app.use('/api/auth', require('./routes/auth'));


app.listen(port,()=>{
    console.log(`Login-Registration app running on port http://localhost:${port}`);
})