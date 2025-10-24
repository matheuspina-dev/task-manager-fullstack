import { useState, useEffect } from 'react';

import api from '../utils/api';

import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Modal from '../components/Modal';

export default () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [addingTask, setAddingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (storedUser) {
      setUser(storedUser);
    } else {
      setTasks(localTasks);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];

    (async () => {
      try {
        if (localTasks.length > 0) {
          for (const task of localTasks) {
            const { _id, ...taskData } = task;
            await api.post('/tasks', taskData);
          }
          localStorage.removeItem('tasks');
        }

        const res = await api.get('/tasks');
        console.log(res.data);
        setTasks(res.data.task);
      } catch (err) {
        console.error('Error transfering local tasks:', err);
      }
    })();
  }, [user]);

  const addTasks = async (text) => {
    if (!user) {
      //Guest mode
      const newTask = {
        _id: Date.now().toString(),
        name: text,
        completed: false,
        priority: 'medium',
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return;
    }

    //Logged-in mode
    try {
      const res = await api.post('tasks', {
        name: text,
        completed: false,
        priority: 'medium',
        userId: user._id,
      });
      setTasks((prev) => [...prev, res.data.task]);
    } catch (err) {
      console.error('Error adding task: ', err);
    }
  };

  const handleAdd = () => {
    setAddingTask((prev) => !prev);
  };

  const handleDelete = async (id) => {
    //Guest mode
    if (!user) {
      const updatedTasks = tasks.filter((task) => task._id !== id);
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      return;
    }

    try {
      await api.delete(`tasks/${id}`);

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task: ', err);
    }
  };

  const handleEdit = async (id) => {
    const task = tasks.find((task) => task._id === id);
    setEditingTask(task);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    const guestTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(guestTasks);
  };

  return (
    <>
      <header>
        <Navbar user={user} handleLogout={handleLogout} />
      </header>
      <main>
        <div className="flex gap-x-4 mt-16 justify-center items-center">
          <button className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer">
            All
          </button>
          <button className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer">
            Today
          </button>
          <button className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer">
            Completed
          </button>
        </div>

        <div className="px-8">
          <button
            onClick={handleAdd}
            className="bg-blue-500 px-8 py-4 mt-8 rounded-lg text-white cursor-pointer"
          >
            Add Task
          </button>
        </div>

        <div className="flex flex-col gap-y-8 mt-8 w-full justify-self-start px-8 text-3xl">
          <TaskList
            tasks={tasks}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>

        {addingTask ? (
          <Modal title="Enter a new task" onClose={handleAdd}>
            <TaskForm addTasks={addTasks} tasks={tasks} onClose={handleAdd} />
          </Modal>
        ) : null}

        {editingTask ? (
          <Modal title="Editing" onClose={() => setEditingTask(null)}>
            <form
              action={async (formData) => {
                const newName = formData.get('edit-input').trim();
                if (!newName) return;

                if (!user) {
                  const updatedTasks = tasks.map((task) =>
                    task._id === editingTask._id
                      ? { ...task, name: newName }
                      : task
                  );
                  setTasks(updatedTasks);
                  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                  setEditingTask(null);
                  return;
                }

                try {
                  const res = await api.patch(`tasks/${editingTask._id}`, {
                    name: newName,
                  });

                  setTasks((prev) =>
                    prev.map((task) =>
                      task._id === editingTask._id ? res.data.task : task
                    )
                  );

                  setEditingTask(null);
                } catch (err) {
                  console.error('Error updating task: ', err);
                }
              }}
            >
              <input
                type="text"
                name="edit-input"
                defaultValue={editingTask.name}
                className="border rounded-lg p-2"
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-gray-400 rounded-lg text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 rounded-lg text-white cursor-pointer">
                  Save
                </button>
              </div>
            </form>
          </Modal>
        ) : null}
      </main>
    </>
  );
};
