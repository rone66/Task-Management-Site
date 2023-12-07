import React, { useState, useEffect } from 'react';
import './App.css';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import logo from './asset/digitalavenues_logo.jpeg';
let API = "https://taskmanagement-backend-6hjp.onrender.com/api/v1"

function App() {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);
  const [taskData,setTaskData]=useState({});
  const [Id,setId]=useState('');

// to fetch all task data
  const getAllTask = async () => {
    const url = API + "/gettask";
    let savedCompletedTasks;
    let savedPendingTasks;
    let savedTasks;
    (async () => {
      savedTasks = await axios.get(url).then(res => (res.data.tasks)).catch(err=>(console.log("error in fetching all tasks",err)));
      savedCompletedTasks = await savedTasks.filter((item) => item.status === "completed");
      savedPendingTasks = await savedTasks.filter((item) => item.status === "pending")

      if (savedPendingTasks) {
        setPendingTasks(savedPendingTasks);
      }

      if (savedCompletedTasks) {
        setCompletedTasks(savedCompletedTasks);
      }

    })()

  }

  useEffect(() => {
    getAllTask()

  }, []);

//to push a new task in mongodb storage
  const handleAddNewTask = async () => {
    let newTaskObj = {
      title: newTaskTitle,
      description: newDescription,
      dueDate: dueDate,
      status: "pending",

    };
    console.log(newTaskObj);

    const url = API + "/createTask"
    const data = await axios.post(url, newTaskObj)
      .then(res => (res.data.task))
      .catch(err=>(console.log("error in create a new tasks",err)))
      ;

    let savedCompletedTasks = await data.filter((item) => item.status === "completed");
    let savedPendingTasks = await data.filter((item) => item.status === "pending")

    if (savedPendingTasks) {
      setPendingTasks(savedPendingTasks);
    }

    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }



    setNewDescription('');
    setNewTaskTitle('');
    setDueDate('');



  };

//delete specific task
  const handleTaskDelete = async (id) => {

    console.log(id);

    const url = API + "/delete/" + id;


    let taskData = await axios.delete(url)
    .then((res) => (res.data.task))
    .catch(err=>(console.log("error in delete tasks",err)))
    ;
    console.log(taskData);

    let savedCompletedTasks = await taskData.filter((item) => item.status === "completed");
    let savedPendingTasks = await taskData.filter((item) => item.status === "pending")

    if (savedPendingTasks) {
      setPendingTasks(savedPendingTasks);
    }

    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }



  };

//delete completed task
  const handleCompletedTaskDelete = (id) => {

    handleTaskDelete(id);
  };

//update status of thask
  const handleComplete = async (id) => {
    const date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var minutes = date.getMinutes();
    var ss = date.getSeconds();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    //console.log(id);

    const option = {
      "status": "completed",
      "completedAt": finalDate,
    }

    const url = API + "/updateStatus/" + id;
    const task = await axios.put(url, option).then(res => (res.data.task)).catch(err=>(console.log("error in update task status",err)));
    let savedCompletedTasks = await task.filter((item) => item.status === "completed");
    let savedPendingTasks = await task.filter((item) => item.status === "pending")

    if (savedPendingTasks) {
      setPendingTasks(savedPendingTasks);
    }

    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }

  };

//edit specific task data
  const handleEditTask = async (id) => {
      const url=API+'/task/'+id;
      const taskData= await axios(url).then(res=>(res.data.task)).catch(err=>(console.log("error in fetching specific task data",err)));
      console.log(taskData);
       setTaskData(taskData);
       setEditing(true);
       setId(id);

      setNewDescription('');
      setNewTaskTitle('');
      setDueDate('');
  };

  function handleEditInputChange(e){
    const {name,value}=e.target;
    setTaskData((prev)=>({...prev,[name]:value}))
  }
//update edited specific task data
  const handleUpdateTask =async(e)=>{
    // e.preventDefault();
    console.log(taskData,Id);
     let option={
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      status: "pending",
    }
    setEditing(false);
    console.log(option);
    const url=API+'/update/'+Id;
    const task= await axios.put(url,option).then(res=>(res.data.taskData)).catch(err=>(console.log("error in fetching update task",err)));

    let savedCompletedTasks = await task.filter((item) => item.status === "completed");
    let savedPendingTasks = await task.filter((item) => item.status === "pending")

    if (savedPendingTasks) {
      setPendingTasks(savedPendingTasks);
    }

    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }

  }

  return (
    <div className="App">
      <div className='heading-wrapper'>
        <img src={logo} alt='Logo' />
        <h1>Task Maneger site</h1>
      </div>


      <div className="task-wrapper">

        {/* conditional rendering for edit task and add task */}
          {
            editing ? 
            (<div className='task-input'>
            <div className="task-input-item">
              <label>Title:</label>
              <input
                type="text"
                value={taskData.title}
                onChange={handleEditInputChange}
                placeholder="title of the task"
                name='title'
              />
            </div>
            <div className="task-input-item">
              <label>Description:</label>
              <textarea
                type="text"
                value={taskData.description}
                onChange={handleEditInputChange}
                placeholder="Write down the description of the task"
                rows={3} cols={40}
                name='description'
              />
            </div>
            <div className="task-input-item">
              <label>Due Date:</label>
              <input
                type="date"
                value={taskData.dueDate}
                onChange={handleEditInputChange}
                placeholder="dd-mm-yyyy"
                name='dueDate'
              />
            </div>

            <div className="task-input-item">
              <button
                className="primary-btn"
                type="button"
                onClick={()=>{handleUpdateTask()}}
              >
                Edit
              </button>
            </div>
          </div>) 
            : 
            (
            <div className='task-input'>
            <div className="task-input-item">
              <label>Title:</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="title of the task"
                name='title'
              />
            </div>
            <div className="task-input-item">
              <label>Description:</label>
              <textarea
                type="text"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Write down the description of the task"
                rows={3} cols={40}
              />
            </div>
            <div className="task-input-item">
              <label>Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                placeholder="dd-mm-yyyy"
              />
            </div>

            <div className="task-input-item">
              <button
                className="primary-btn"
                type="button"
                onClick={handleAddNewTask}
              >
                Add
              </button>
            </div>
          </div>
            )
          }
        
          {/* pending and completed button */}
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen(false)}
          >
            Pending
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="task-list">

          {isCompletedScreen === false &&
            pendingTasks.map((item, index) => (
              <div className="task-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>Description: {item.description}</p>
                  <p>Due Date: {item.dueDate}</p>

                </div>
                <div>
                  <MdEdit
                    title='edit?'
                    className='icon'
                    onClick={() => handleEditTask(item._id)}
                  />
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handleTaskDelete(item._id)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className=" check-icon"
                    onClick={() => handleComplete(item._id)}
                  />
                </div>
              </div>
            ))
          }

          {isCompletedScreen === true &&
            completedTasks.map((item, index) => (
              <div className="task-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>Description: {item.description}</p>
                  <p>Due Date: {item.dueDate}</p>
                  <p> <i>Completed at: {item.completedAt}</i></p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleCompletedTaskDelete(item._id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
