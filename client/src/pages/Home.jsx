import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/Modal';
import useTasks from '../hooks/useTasks';
import storage from '../services/storage';

export default () => {
  const [user, setUser] = useState(null);
  const [addingTask, setAddingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const { tasks, addTask, deleteTask, updateTask } = useTasks(user);

  const handleLogout = () => {
    storage.clearUser();
    setUser(null);
  };

  const toggleCompleted = (id, newStatus) => {
    updateTask(id, { completed: newStatus });
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
            onClick={() => setAddingTask(true)}
            className="bg-blue-500 px-8 py-4 mt-8 rounded-lg text-white cursor-pointer"
          >
            Add Task
          </button>
        </div>

        <div className="flex flex-col gap-y-8 mt-8 w-full justify-self-start px-8 text-3xl">
          <TaskList
            tasks={tasks}
            handleDelete={deleteTask}
            handleEdit={(id) => {
              const task = tasks.find((task) => task._id === id);
              setEditingTask(task);
            }}
            toggleCompleted={toggleCompleted}
          />
        </div>

        {addingTask ? (
          <Modal title="Enter a new task" onClose={() => setAddingTask(false)}>
            <TaskForm
              addTasks={addTask}
              tasks={tasks}
              onClose={() => setAddingTask(false)}
            />
          </Modal>
        ) : null}

        {editingTask ? (
          <Modal title="Editing" onClose={() => setEditingTask(null)}>
            <form
              action={async (formData) => {
                const newName = formData.get('edit-input').trim();
                if (!newName) return;
                await updateTask(editingTask._id, { name: newName });
                setEditingTask(null);
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
