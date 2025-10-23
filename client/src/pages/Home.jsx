import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Modal from '../components/Modal';

const url = 'http://localhost:5000/api/v1/tasks';

export default () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    axios.get(url).then((res) => {
      setTasks(res.data.task);
    });
  }, []);

  const addTasks = async (text) => {
    try {
      const res = await axios.post(url, {
        name: text,
        completed: false,
        priority: 'medium',
      });
      setTasks((prev) => [...prev, res.data.task]);
    } catch (err) {
      console.error('Error adding task: ', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error('Error deleting task: ', err);
    }
  };

  const handleEdit = async (id) => {
    const task = tasks.find((task) => task._id === id);
    setEditingTask(task);
  };

  return (
    <>
      <header>
        <Navbar />
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

        <TaskForm addTasks={addTasks} tasks={tasks} />

        <div className="flex flex-col gap-y-8 mt-8 w-2/3 justify-self-center px-8 text-3xl bg-blue-500">
          <TaskList
            tasks={tasks}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>

        {editingTask ? (
          <Modal title="Editing" onClose={() => setEditingTask(null)}>
            <form
              action={async (formData) => {
                const newName = formData.get('edit-input').trim();
                if (!newName) return;

                try {
                  const res = await axios.patch(`${url}/${editingTask._id}`, {
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
