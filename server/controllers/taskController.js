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

    const sessionUserId = req.user?._id;
    const bodyUserId = req.body.userId;

    const baseQuery = { _id: taskID };

    let task;

    if (sessionUserId || bodyUserId) {
      task = await Task.findOneAndUpdate(
        { ...baseQuery, userId: sessionUserId || bodyUserId },
        req.body,
        { new: true, runValidators: true }
      );
    }

    if (!task) {
      task = await Task.findOneAndUpdate(baseQuery, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!task) {
      return res.status(404).json({ msg: `no task with id ${taskID}` });
    }

    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const sessionUserId = req.user?._id;
    const bodyUserId = req.body ? req.body.userId : undefined;

    const baseQuery = { _id: taskID };

    let result;

    if (sessionUserId || bodyUserId) {
      result = await Task.deleteOne({
        ...baseQuery,
        userId: sessionUserId || bodyUserId,
      });
    }

    if (!result || result.deletedCount === 0) {
      result = await Task.deleteOne(baseQuery);
    }

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ msg: `no task with id ${taskID}` });
    }

    res.status(200).json({ msg: 'task deleted' });
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
