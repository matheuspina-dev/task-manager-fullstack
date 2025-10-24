const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user?._id;
    const query = userId ? { userId } : {};

    const tasks = await Task.find(query);
    res.status(200).json({ task: tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const userId = req.user?._id;

    const task = await Task.findOne({ _id: taskID, userId });
    if (!task) {
      res.status(404).json({ msg: `no task with id ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const userId = req.user?._id;
    const taskData = { ...req.body };

    if (userId) taskData.userId = userId;

    const task = await Task.create(taskData);
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const userId = req.user?._id;

    const task = await Task.findOneAndUpdate(
      { _id: taskID, userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!task) {
      res.status(404).json({ msg: `no task with id ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const userId = req.user?._id;

    const task = await Task.deleteOne({ _id: taskID, userId });
    if (!task) {
      res.status(404).json({ msg: `no task with id ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
