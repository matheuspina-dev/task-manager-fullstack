import TaskItem from "./TaskItem";

export default (props) => {
  return (
    <div className="flex flex-col gap-4">
      {props.tasks.map((task) => (
        <div key={task._id}>
          <div className="flex justify-between items-center">
            <div className="flex gap-x-4 items-start">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  props.toggleCompleted(task._id, !task.completed)
                }
                className="w-6 h-6 mt-[1px]"
              />
              <div className="flex flex-col capitalize">
                <h1 className="text-3xl font-medium leading-6">{task.name}</h1>
                <h2 className="text-sm text-gray-500 leading-5 mt-2">
                  {task.description}
                </h2>
              </div>
            </div>
            <TaskItem
              id={task._id}
              handleDelete={() => props.handleDelete(task._id)}
              handleEdit={() => props.handleEdit(task._id)}
            />
          </div>

          <hr className="border-t border-gray-200 mt-8" />
        </div>
      ))}
    </div>
  );
};
