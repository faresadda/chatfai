const database=require('./config/database')
const express=require('express')
const app=express()
require('dotenv').config()
const usersRoutes=require('./routes/usersRoutes')
const errorMiddleware=require('./middlewares/errorMiddleware')
const appError=require('./utils/appError')
const cors=require('cors')
const apikeyMiddleware = require('./middlewares/apikeyMiddleware')

app.use(cors())
app.use(express.json())

app.use('/api/chatfai',usersRoutes)

app.use(apikeyMiddleware)
app.use(errorMiddleware)

const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.all('*',(req,res,next)=>{
  return res.status(404).json(appError.createError(404,'not found'))})

  
  console.log("Env Key:", `"${process.env.MY_API_KEY}"`);
  

app.listen(process.env.PORT,()=>{
    console.log('listenning on port ',process.env.PORT)
})
