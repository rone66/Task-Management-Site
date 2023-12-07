// all routes are defined

const express =  require("express");
const route = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const {Signup,Login}=require("../controller/userController");
const {createTask,getAllTask,getTaskById,updateTask,updateTaskStatus,deleteTask}=require("../controller/taskController")






route.post("/signup",Signup);
route.post("/login",Login);

route.post("/createTask",createTask);
route.get("/gettask",getAllTask);
route.get("/task/:id",getTaskById);
route.put("/update/:id",updateTask);
route.put("/updateStatus/:id",updateTaskStatus);
route.delete("/delete/:id",deleteTask);

module.exports=route;
