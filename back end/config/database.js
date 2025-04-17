const mongoose=require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.DATABASE_URL)
   .then(()=>{console.log('Database connection successeful')})
   .catch((err)=>{console.log('Error : database connection failed')})