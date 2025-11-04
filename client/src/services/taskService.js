import api from '../utils/api';

const taskService = {
  async getAll() {
    const res = await api.get('/tasks');
    return res.data.task;
  },
  async create(data) {
    const res = await api.post('/tasks', data);
    return res.data.task;
  },
  async update(id, data) {
    const res = await api.patch(`/tasks/${id}`, data);
    return res.data.task;
  },
  async remove(id) {
    await api.delete(`/tasks/${id}`);
    return true;
  },
};

export default taskService;
