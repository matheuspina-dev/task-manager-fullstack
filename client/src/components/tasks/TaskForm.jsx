import { useState } from "react";

const EMPTY_TASK = {
  name: "",
  description: "",
  dueDate: "",
  priority: "medium",
  isRecurring: false,
  recurrence: {
    frequency: "",
    interval: 1,
    daysOfWeek: [],
    endDate: "",
  },
  completed: false,
};

export default (props) => {
  const [taskData, setTaskData] = useState(
    () => props.initialTask || EMPTY_TASK
  );

  const toggleDay = (day) => {
    setTaskData((prev) => {
      const { daysOfWeek } = prev.recurrence;
      const newDays = daysOfWeek.includes(day)
        ? daysOfWeek.filter((d) => d !== day)
        : [...daysOfWeek, day];
      return {
        ...prev,
        recurrence: { ...prev.recurrence, daysOfWeek: newDays },
      };
    });
  };

  const handleSubmit = async (formData) => {
    const name = formData.get("task-name");
    const description = formData.get("task-description");
    const dueDate = formData.get("task-due-date");
    const priority = formData.get("task-priority");
    const isRecurring = !!formData.get("task-is-recurring");
    const recurrence = {
      frequency: formData.get("task-frequency"),
      interval: formData.get("task-interval"),
      endDate: formData.get("task-end-date"),
      daysOfWeek: taskData.recurrence.daysOfWeek,
    };

    const builtTask = {
      ...taskData,
      name,
      description,
      dueDate,
      priority,
      isRecurring,
      recurrence,
    };

    if (props.action) {
      await props.action(builtTask);
    }
    props.onClose();
  };

  return (
    <form
      action={handleSubmit}
      className="mt-8 flex w-full flex-col gap-y-4 items-stretch"
    >
      <label className="flex flex-col">
        <span className="mb-1">Name:</span>
        <input
          type="text"
          placeholder="Walk the dog"
          name="task-name"
          value={taskData.name}
          onChange={(e) =>
            setTaskData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border rounded-lg px-4 py-2 w-full"
        />
      </label>

      <label className="flex w-full flex-col">
        <span className="mb-1">Description:</span>
        <textarea
          placeholder="I have to walk the dog for a few miles..."
          name="task-description"
          value={taskData.description}
          onChange={(e) =>
            setTaskData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full border rounded-lg px-4 py-2 h-24"
        />
      </label>

      <label className="flex w-full flex-col">
        <span className="mb-1">Due Date:</span>
        <input
          type="date"
          name="task-due-date"
          value={taskData.dueDate}
          onChange={(e) =>
            setTaskData((prev) => ({ ...prev, dueDate: e.target.value }))
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </label>

      <label className="flex w-full flex-col">
        <span className="mb-1">Priority:</span>
        <select
          name="task-priority"
          value={taskData.priority}
          onChange={(e) =>
            setTaskData((prev) => ({ ...prev, priority: e.target.value }))
          }
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="flex items-center gap-x-2">
        <input
          type="checkbox"
          name="task-is-recurring"
          checked={taskData.isRecurring}
          onChange={(e) =>
            setTaskData((prev) => ({
              ...prev,
              isRecurring: e.target.checked,
            }))
          }
        />
        <span>Make this a recurring task?</span>
      </label>

      {taskData.isRecurring && (
        <div className="flex flex-col gap-y-4 w-full">
          <h3 className="font-semibold">Recurrence</h3>

          <label className="flex w-full flex-col">
            <span className="mb-1">Frequency:</span>
            <select
              name="task-frequency"
              value={taskData.recurrence.frequency}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, frequency: e.target.value },
                }))
              }
              className="w-full border rounded-lg px-4 py-2 w-full"
            >
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="flex w-full flex-col">
            <span className="mb-1">Interval:</span>
            <input
              type="number"
              name="task-interval"
              min="1"
              value={taskData.recurrence.interval}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, interval: e.target.value },
                }))
              }
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          <label className="flex w-full flex-col">
            <span className="mb-1">End Date:</span>
            <input
              type="date"
              name="task-end-date"
              value={taskData.recurrence.endDate}
              onChange={(e) =>
                setTaskData((prev) => ({
                  ...prev,
                  recurrence: { ...prev.recurrence, endDate: e.target.value },
                }))
              }
              className="w-full border rounded-lg px-4 py-2"
            />
          </label>

          {taskData.recurrence.frequency === "weekly" && (
            <div className="flex flex-wrap gap-2 w-full">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
                <label key={day} className="flex items-center gap-x-1">
                  <input
                    type="checkbox"
                    checked={taskData.recurrence.daysOfWeek.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 px-8 py-4 rounded-lg text-white cursor-pointer"
      >
        {props.initialTask ? "Save changes" : "Add task"}
      </button>
    </form>
  );
};
