const mongoose =require('mongoose')

const leadSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^\S+@\S+\.\S+$/,
        lowercase:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
        match:/^\d{10}$/
    },
    company:{
        type:String,
        required:true,
        minlength:2,
        maxength:100
    },
    status:{
        type:String,
        enum:['New','Contacted','Interested','Not Interested','Converted'],
        default:'New'
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

})

const Lead = mongoose.model('Lead',leadSchema)

module.exports = Lead ;