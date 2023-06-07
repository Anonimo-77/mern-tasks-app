const router = require("express").Router();
const { Task, taskSchema } = require("../models/Task");
const {User} = require("../models/User");
const { ObjectId } = require("mongoose").Types;


router.post("/", async (req,res) => {
    try {
        const { userId, title, body } = req.body;
        const status = "todo";
        const user = await User.findById(userId);
        var tasks = user.tasks;
        const task = new Task({title,body,status});
        task.save();
        tasks.push(task);
        await User.findByIdAndUpdate(userId, {tasks});
        res.json(true);
    } catch(err) {
        console.log("helloo")
        res.status(500).json(err)
    }
});
router.put("/", async (req,res) => {
    try {
        const { userId, taskId, title, body, status } = req.body;
        console.log("-----")
        await Task.findByIdAndUpdate(taskId, {title,body,status});
        
        const ntask = await Task.findById(taskId);
        console.log(ntask);
        const tasks = (await User.findById(userId)).tasks;
        let idxx = tasks.map(el => el._id.toString()).indexOf(taskId);
        tasks[idxx]=ntask;
        console.log(tasks)
        var user =await User.findById(userId);
        user.tasks = tasks;
        console.log(user);
        await user.save();
        /*console.log(tasks)
        let objId = new ObjectId(taskId)
        console.log(objId);
        tasks.forEach(el => console.log(el._id));
        const tasksss = (tasks.map(el => el._id.toString()));
        const taskIdx = tasksss.indexOf(objId.toString());
        tasks[taskIdx]=ntask;
        console.log(tasks)*/
        /*const rr = await User.findByIdAndUpdate(userId,{'$set': {
            tasks:tasks
        }});*/
        res.json(true);
    } catch(err) {
        console.log(err);
        res.status(500).json(err)
    }
});
router.delete("/:taskId", async (req,res) => {
    console.log("heloooooo")
    try {
        const { taskId } = req.params;
        const { userId } = req.query;
        console.log(taskId);
        await Task.findByIdAndRemove(taskId);
        const user = await User.findById(userId);
        var userTasks = user.tasks;
        userTasks.splice(userTasks.map(el => el._id.toString()).indexOf(taskId),1);
        user.tasks=userTasks;
        await user.save();
        res.json(true);
    } catch(err) {
        res.status(500).json(err)
    }
});

router.get("/:userId", async (req,res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const tasks = (await User.findById(userId)).tasks;
        res.json(tasks);
    } catch(err) {
        res.status(500).json(err)
    }
})
  module.exports = router;