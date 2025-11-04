import TaskItem from './TaskItem';

export default (props) => {
  return (
    <div className="flex flex-col gap-4">
      {props.tasks.map((task) => (
        <div key={task._id} className="flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => props.toggleCompleted(task._id, !task.completed)}
            />
            <h1>{task.name}</h1>
          </div>
          <TaskItem
            id={task._id}
            handleDelete={() => props.handleDelete(task._id)}
            handleEdit={() => props.handleEdit(task._id)}
          />
        </div>
      ))}
    </div>
  );
};
