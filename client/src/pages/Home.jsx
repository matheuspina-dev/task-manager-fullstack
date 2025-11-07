import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/Modal';
import useTasks from '../hooks/useTasks';
import storage from '../services/storage';
import Sidebar from '../components/Sidebar';
import SidebarItem from '../components/SidebarItem';
import { CiCalendarDate } from 'react-icons/ci';
import ColorPalette from '../ColorPalette';

export default () => {
  const [user, setUser] = useState(null);
  const [addingTask, setAddingTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState('21.5rem');
  const [activeView, setActiveView] = useState('all');

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

  const isToday = (dateStr) => {
    if (!dateStr) return false;

    const taskDate = dateStr.slice(0, 10);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayLocal = `${year}-${month}-${day}`;

    return taskDate === todayLocal;
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeView === 'all') return true;
    if (activeView === 'today') return isToday(task.dueDate);
    if (activeView === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="flex">
      <header className="flex">
        <Sidebar onWidthChange={setSidebarWidth} user={user}>
          <SidebarItem
            icon={<CiCalendarDate size={20} />}
            text="All"
            onClick={() => setActiveView('all')}
            active={activeView === 'all'}
          />
          <SidebarItem
            icon={<CiCalendarDate size={20} />}
            text="Today"
            onClick={() => setActiveView('today')}
            active={activeView === 'today'}
          />
          <SidebarItem
            icon={<CiCalendarDate size={20} />}
            text="Completed"
            alert
            onClick={() => setActiveView('completed')}
            active={activeView === 'completed'}
          />
          <SidebarItem
            icon={<CiCalendarDate size={20} />}
            text="Statisctics"
            alert
          />
          <hr className="my-3" />
          <SidebarItem icon={<CiCalendarDate size={20} />} text="Settings" />
          <SidebarItem icon={<CiCalendarDate size={20} />} text="Help" />
        </Sidebar>
        <Navbar
          user={user}
          handleLogout={handleLogout}
          sidebarWidth={sidebarWidth}
          activeView={activeView}
        />
      </header>
      <main
        className="p-8 pt-20 min-h-screen w-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <div>
          <button
            onClick={() => setAddingTask(true)}
            className="bg-tanager-primary px-8 py-4 mt-8 rounded-lg text-white cursor-pointer"
          >
            Add Task
          </button>
        </div>

        <div className="flex flex-col gap-y-8 mt-8 w-full justify-self-start px-8 text-3xl">
          <TaskList
            tasks={filteredTasks}
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
              action={async (newTask) => {
                await addTask(newTask);
              }}
              onClose={() => setAddingTask(false)}
            />
          </Modal>
        ) : null}

        {editingTask ? (
          <Modal title="Editing" onClose={() => setEditingTask(null)}>
            <TaskForm
              initialTask={editingTask}
              action={async (updatedTask) => {
                await updateTask(editingTask._id, updatedTask);
              }}
              onClose={() => setEditingTask(null)}
            />
          </Modal>
        ) : null}
      </main>
      <ColorPalette />
    </div>
  );
};
