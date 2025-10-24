import { useState } from 'react';

export default (props) => {
  const [name, setName] = useState('');

  const handleSubmit = (formData) => {
    const text = formData.get('task-input');
    if (!text) return;
    props.addTasks(text);
    setName('');
    props.onClose();
  };

  return (
    <form
      action={handleSubmit}
      className="flex gap-8 mt-8 justify-self-start items-center"
    >
      <label htmlFor="task-input" className="sr-only">
        Enter your new task
      </label>
      <div className="flex justify-between w-full gap-4">
        <input
          type="text"
          placeholder="Walk the dog"
          name="task-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-4 flex-grow"
        />
        <button className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer w-2/3">
          Add task
        </button>
      </div>
    </form>
  );
};
