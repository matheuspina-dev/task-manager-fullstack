import { useState } from 'react';

export default (props) => {
  const [name, setName] = useState('');

  const handleSubmit = (formData) => {
    const text = formData.get('task-input');
    if (!text) return;
    props.addTasks(text);
    setName('');
  };

  return (
    <form
      action={handleSubmit}
      className="flex gap-8 mt-8 justify-center items-center flex-col"
    >
      <label htmlFor="task-input" className="text-3xl">
        Enter your new task
      </label>
      <div className="flex gap-x-8">
        <input
          type="text"
          placeholder="Walk the dog"
          name="task-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-1 rounded-lg px-4"
        />
        <button className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer">
          Add task
        </button>
      </div>
    </form>
  );
};
