import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import storage from '../services/storage';

export default (user) => {
  const [tasks, setTasks] = useState([]);

  //Get tasks
  useEffect(() => {
    const localTasks = storage.getLocalTasks();

    //Guest mode
    if (!user) {
      setTasks(localTasks);
      return;
    }

    //Logged-in mode
    const loadTasks = async () => {
      try {
        if (localTasks.length > 0) {
          for (const task of localTasks) {
            const { _id, ...taskData } = task;
            await taskService.create({
              ...taskData,
              userId: user._id,
            });
          }
          storage.clearLocalTasks();
        }
        const res = await taskService.getAll();
        setTasks(res);
      } catch (err) {
        console.log('Error loading tasks:', err);
      }
    };

    loadTasks();
  }, [user]);

  const addTask = async (name) => {
    //Guest mode
    if (!user) {
      const newTask = {
        _id: Date.now().toString(),
        name,
        completed: false,
        priority: 'medium',
      };
      const updated = [...tasks, newTask];
      setTasks(updated);
      storage.saveLocalTasks(updated);
      return;
    }

    //Logged-in mode
    try {
      const created = await taskService.create({
        name,
        completed: false,
        priority: 'medium',
        userId: user._id,
      });
      setTasks((prev) => [...prev, created]);
    } catch (err) {
      console.error('Error adding task: ', err);
    }
  };

  const deleteTask = async (id) => {
    //Guest mode
    if (!user) {
      const updated = tasks.filter((task) => task._id !== id);
      setTasks(updated);
      storage.saveLocalTasks(updated);
      return;
    }

    //Logged-in mode
    try {
      await taskService.remove(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const updateTask = async (id, data) => {
    //Guest mode
    if (!user) {
      const updated = tasks.map((task) => {
        return task._id === id ? { ...task, ...data } : task;
      });
      setTasks(updated);
      storage.saveLocalTasks(updated);
      return;
    }

    //Logged-in mode
    try {
      const updatedTask = await taskService.update(id, {
        ...data,
        userId: user._id,
      });
      setTasks((prev) =>
        prev.map((task) => {
          return task._id === id ? updatedTask : task;
        })
      );
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    setTasks,
  };
};
