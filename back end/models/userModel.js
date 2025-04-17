const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            minlength: [2, 'Too short first name'],
            maxlength: [32, 'Too long first name'],
        },
        email:{
            type:String,
            unique:true,
            require:true
        },
        password:{
            type:String,
            require:true,
            minLength:[8,'Too short password']
        },
        token:{
            type:String,
            require:true
        },
        isVerified:{
            type:Boolean,
            require:true,
        },
        verificationCode:{
            type:Number,
            require:true,
        }
    },{ timestamps: true }
)
module.exports=mongoose.model('User',userSchema,'users')