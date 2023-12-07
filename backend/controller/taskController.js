const Task=require("../models/taskSchema");
//create a task

const createTask=async(req,res)=>{
    try{
        const{title,description,dueDate,status,createdAt}=req.body;
        //console.log(createdAt);
        const task=new Task(req.body);
        const savedTask= await task.save();
        const allTasks=await Task.find()
        res.json({
            task:allTasks,
        })
    }
    catch(err){
        console.log(err);
        return res.status(404).json({
            error:"Error while creating task"
        })
    } 
}

// get all tasks

const getAllTask=async (req,res)=>{
    // // let category= req.query.category;
    // // //console.log(category);
    // let tasks;

    try{
        const tasks= await Task.find();
        res.json({
            tasks,
        }) 
    
        
    }catch(err){
        console.log(err);
        return res.status(400).json({
            error:"Error in fetching;"
        })

    }

}

// get a specific taskdata by id

const getTaskById=async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
    try {
        const task= await Task.findById(id);
        res.status(200).json(
            {task}
        ) 
        
    } catch (error) {

        console.log(error);
        return res.status(400).json({
            error:"Error in fetching by task id;"
        })
        
    }

}

//update whole task

const updateTask=async(req,res)=>{
    let id=req.params.id;
    //console.log(id);

    try {
        const task= await Task.findById(id);

        if(!task){
            return res.status(404).json({message:"task not found by that id"});
        }
        await Task.findByIdAndUpdate(id,{$set:req.body});
        const taskData=await Task.find()

        return res.status(200).json({taskData});
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error:"Error in update task;"
        })
    }

}

//update task status

const updateTaskStatus=async(req,res)=>{
    let id=req.params.id;
    //console.log(id);

    try {
        const task= await Task.findById(id);

        if(!task){
            return res.status(404).json({message:"task not found by that id"});
        }
        await Task.findByIdAndUpdate(id,{$set:req.body});

        const allTasks=await Task.find()
        res.json({
            task:allTasks,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            error:"Error in update task;"
        })
    }

}

// delete a task

const deleteTask=async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
    try {
        const task= await Task.findByIdAndDelete(id);

        // if(!task){
        //     return res.status(404).json({message:"task not found by that id"});
        // }
        // await task.delete();
        
        const data=await Task.find();

        return res.status(200).json({task:data},);

        
    } catch (error) {
        console.log(error);
        return res.status(403).json({
            error:"Error in delete task;"
        })
        
    }

}

module.exports={createTask,getAllTask,getTaskById,updateTask,updateTaskStatus,deleteTask};