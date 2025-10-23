import TaskItem from './TaskItem';

export default (props) => {
  const task = props.tasks.map((task) => {
    return (
      <div key={task._id} className="flex justify-between items-center">
        <h1>{task.name}</h1>
        <TaskItem
          id={task._id}
          handleDelete={() => props.handleDelete(task._id)}
          handleEdit={() => props.handleEdit(task._id)}
        />
      </div>
    );
  });

  return task;
};
