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

const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use('/api/chatfai',usersRoutes)
app.all('*',(req,res,next)=>{
    return res.status(404).json(appError.createError(404,'not found'))})
app.use(errorMiddleware)
app.use(apikeyMiddleware)

app.listen(process.env.PORT,()=>{
    console.log('listenning on port ',process.env.PORT)
})
