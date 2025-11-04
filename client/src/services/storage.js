const LOCAL_TASKS_KEY = 'tasks';
const USER_KEY = 'user';

const storage = {
  getLocalTasks() {
    return JSON.parse(localStorage.getItem(LOCAL_TASKS_KEY)) || [];
  },
  saveLocalTasks(tasks) {
    localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
  },
  clearLocalTasks() {
    localStorage.removeItem(LOCAL_TASKS_KEY);
  },
  getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  },
  clearUser() {
    localStorage.removeItem(USER_KEY);
  },
};

export default storage;
