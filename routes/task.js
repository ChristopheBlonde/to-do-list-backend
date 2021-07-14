const express = require("express");
const router = express.Router();
const isAuthorized = require("../middlewares/isAuthorized");

const Task = require("../models/Task");
const User = require("../models/User");

router.post("/task/add", isAuthorized, async (req, res) => {
  try {
    const { text, checkBox } = req.fields;
    /* Add new task in BDD */
    if ((text && checkBox === false) || checkBox === true) {
      const newTask = new Task({
        text: text,
        checkBox: checkBox,
        user: req.user._id,
      });
      await newTask.save();
      /* search user for add task in own ref */
      const updateUser = await User.findById({ _id: req.user._id });
      updateUser.tasks.push({ task: newTask._id });
      await updateUser.save();
      res.status(200).json(newTask);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/task", isAuthorized, async (req, res) => {
  try {
    const tasks = await User.findById({ _id: req.user._id });
    let upTask;
    const arrTasks = [];
    for (let i = 0; i < tasks.tasks.length; i++) {
      upTask = await Task.findById({ _id: tasks.tasks[i].task });
      arrTasks.push({
        text: upTask.text,
        checkBox: upTask.checkBox,
        id: upTask.id,
      });
    }
    res.status(200).json(arrTasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/task/update/:id", isAuthorized, async (req, res) => {
  try {
    const { checkBox } = req.fields;
    const taskUpdate = await Task.findById(req.params.id);
    taskUpdate.checkBox = checkBox;
    await taskUpdate.save();
    res.status(200).json(taskUpdate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/task/delete/:id", isAuthorized, async (req, res) => {
  try {
    /* Delete ref task in user info */
    const user = await User.findById({ _id: req.user._id });
    let index;
    for (let i = 0; i < user.tasks.length; i++) {
      const tested = user.tasks[i].task.toString();
      if (tested === req.params.id) {
        index = user.tasks.indexOf(user.tasks[i]);
      }
    }
    user.tasks.splice(index, 1);
    await user.save();
    /* Delete task */
    const taskDeleted = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Task Deleted :${taskDeleted.text}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
