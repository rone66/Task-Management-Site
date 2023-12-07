const mongoose=require("mongoose");

const taskSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    dueDate:{
        type:String,
        required:true,
    }, 
    createdAt: {
		type:Date,
		default:Date.now
	},
    status:{
        type: String,
		enum: ["pending", "completed"],
    },
    completedAt:{
        type:String,
    }

})

const task = mongoose.model('task',taskSchema);
module.exports=task;