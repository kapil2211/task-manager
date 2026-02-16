import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addTask,
  fetchTasks,
  setFilter,
  editTask, removeTask
} from "../features/task/taskSlice";
import { logout } from "../features/auth/authSlice";
import type { Task } from "../features/task/taskSlice";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { tasks, filter, loading, error } = useAppSelector((state) => state.task);

  const [view, setView] = useState<"create" | "list">("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});
  const [pausedTasks, setPausedTasks] = useState<Set<string>>(new Set());

  /* ================= FETCH TASKS ================= */

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  /* ================= TIMER ENGINE ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimers((prev) => {
        const updated: Record<string, number> = { ...prev };

        for (const id in updated) {
          if (!pausedTasks.has(id)) {
            updated[id] = updated[id] + 1;
          }
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pausedTasks]);


  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };


  const handleStart = (task: Task) => {
    if (task.completed) return;

    setActiveTimers((prev) => ({
      ...prev,
      [task.id]: task.totalTime || 0,
    }));

    setPausedTasks((prev) => {
      const updated = new Set(prev);
      updated.delete(task.id);
      return updated;
    });

    dispatch(
      editTask({
        id: task.id,
        updates: { startedAt: Date.now() },
      })
    );
  };

  const handlePause = (task: Task) => {
    setPausedTasks((prev) => new Set(prev).add(task.id));
  };


  const handleCompleteToggle = (task: Task) => {
    const currentTime = activeTimers[task.id];

    if (currentTime !== undefined) {
      dispatch(
        editTask({
          id: task.id,
          updates: {
            completed: !task.completed,
            startedAt: null,
            totalTime: currentTime,
          },
        })
      );

      setActiveTimers((prev) => {
        const updated = { ...prev };
        delete updated[task.id];
        return updated;
      });

      setPausedTasks((prev) => {
        const updated = new Set(prev);
        updated.delete(task.id);
        return updated;
      });
    } else {
      dispatch(
        editTask({
          id: task.id,
          updates: { completed: !task.completed },
        })
      );
    }
  };



  const handleResume = (task: Task) => {
    setPausedTasks((prev) => {
      const updated = new Set(prev);
      updated.delete(task.id);
      return updated;
    });
  };


  /* ================= ADD TASK ================= */


  const handleAdd = () => {
    if (!title.trim()) return;

    dispatch(
      addTask({
        title,
        description,
        priority,
        dueDate,
      })
    );

    setTitle("");
    setDescription("");
    setPriority("low");
    setDueDate("");
    setView("list");
  };

  /* ================= FILTER ================= */

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });








  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-emerald-100 via-white to-rose-100">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>

        <button
          onClick={() => dispatch(logout())}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>


      {loading && (
        <div className="max-w-3xl mx-auto space-y-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
            >
              <div className="h-6 w-1/2 rounded skeleton" />
              <div className="h-4 w-3/4 rounded skeleton" />
              <div className="h-4 w-1/3 rounded skeleton" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center mb-6 text-red-500">{error}</div>
      )}

      {/* Capsule Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/40 backdrop-blur-xl p-1 rounded-full shadow-lg flex">

          <button
            onClick={() => setView("create")}
            className={`px-6 py-2 rounded-full transition ${view === "create"
              ? "bg-emerald-500 text-white"
              : "text-gray-700"
              }`}
          >
            Create
          </button>

          <button
            onClick={() => setView("list")}
            className={`px-6 py-2 rounded-full transition ${view === "list"
              ? "bg-rose-500 text-white"
              : "text-gray-700"
              }`}
          >
            List
          </button>
        </div>
      </div>

      {/* CREATE VIEW */}
      {view === "create" && (
        <div className="max-w-lg mx-auto bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl space-y-6">

          <input
            type="text"
            placeholder="Task Title"
            className="w-full rounded-xl border px-4 py-2 bg-white/60"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Task Description"
            className="w-full rounded-xl border px-4 py-2 bg-white/60"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Priority */}
          <div>
            <p className="mb-2 font-medium text-gray-700">
              Priority
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setPriority("low")}
                className={`px-4 py-2 rounded-full transition ${priority === "low"
                  ? "bg-emerald-500 text-white shadow-lg scale-105"
                  : "bg-white/60 text-gray-700"
                  }`}
              >
                Low
              </button>

              <button
                onClick={() => setPriority("medium")}
                className={`px-4 py-2 rounded-full transition ${priority === "medium"
                  ? "bg-yellow-400 text-white shadow-lg scale-105"
                  : "bg-white/60 text-gray-700"
                  }`}
              >
                Medium
              </button>

              <button
                onClick={() => setPriority("high")}
                className={`px-4 py-2 rounded-full transition ${priority === "high"
                  ? "bg-rose-500 text-white shadow-lg scale-105"
                  : "bg-white/60 text-gray-700"
                  }`}
              >
                High
              </button>

            </div>
          </div>

          {/* Due Date */}
          <div>
            <p className="mb-2 font-medium text-gray-700">
              Due Date
            </p>

            <input
              type="date"
              className="w-full rounded-xl border px-4 py-2 bg-white/60"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition"
          >
            Add Task
          </button>

        </div>
      )}

      {/* LIST VIEW */}

      {view === "list" && (
        <div>

          {/* Filter Capsules */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/40 backdrop-blur-xl p-1 rounded-full shadow-lg flex gap-2">

              <button
                onClick={() => dispatch(setFilter("all"))}
                className={`px-5 py-2 rounded-full transition ${filter === "all"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-700"
                  }`}
              >
                All
              </button>

              <button
                onClick={() => dispatch(setFilter("pending"))}
                className={`px-5 py-2 rounded-full transition ${filter === "pending"
                  ? "bg-rose-500 text-white shadow-md"
                  : "text-gray-700"
                  }`}
              >
                Pending
              </button>

              <button
                onClick={() => dispatch(setFilter("completed"))}
                className={`px-5 py-2 rounded-full transition ${filter === "completed"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-700"
                  }`}
              >
                Completed
              </button>

            </div>
          </div>



          {/* Task List */}
          {loading ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4"
                >
                  <div className="h-6 w-1/2 rounded skeleton" />
                  <div className="h-4 w-3/4 rounded skeleton" />
                  <div className="h-4 w-1/3 rounded skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">

              {filteredTasks.length === 0 && (
                <div className="text-center text-gray-600 bg-white/40 backdrop-blur-xl p-8 rounded-2xl">
                  No tasks found
                </div>
              )}

              {filteredTasks.map((task) => {

                const priorityColor =
                  task.priority === "low"
                    ? "bg-emerald-200 text-emerald-700"
                    : task.priority === "medium"
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-rose-200 text-rose-700";

                const runningTime =
                  activeTimers[task.id] ?? task.totalTime ?? 0;

                return (
                  <div
                    key={task.id}
                    className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex justify-between items-start"
                  >
                    <div className="space-y-3">

                      <h3
                        className={`text-xl font-semibold ${task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                          }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-gray-600 text-sm">
                          {task.description}
                        </p>
                      )}
                      <div className="text-sm text-blue-600 font-medium">
                        ⏱ {formatTime(runningTime)}
                      </div>

                      {task.completed && (
                        <div className="text-xs text-gray-500">
                          Total Time: {formatTime(runningTime)}
                        </div>
                      )}

                      <div className="flex gap-3 flex-wrap items-center">

                        <span className={`px-3 py-1 text-xs rounded-full ${priorityColor}`}>
                          {task.priority.toUpperCase()}
                        </span>

                        <span
                          className={`px-3 py-1 text-xs rounded-full ${task.completed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                            }`}
                        >
                          {task.completed ? "Completed" : "Pending"}
                        </span>

                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {task.dueDate}
                          </span>
                        )}

                        <span className="text-xs text-gray-400">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>

                      </div>
                    </div>

                    <div className="flex flex-col gap-3">

                      {!task.completed &&
                        activeTimers[task.id] === undefined && (
                          <button
                            onClick={() => handleStart(task)}
                            className="text-blue-600 hover:underline"
                          >
                            Start
                          </button>
                        )}

                      {/* Pause */}
                      {!task.completed &&
                        activeTimers[task.id] !== undefined &&
                        !pausedTasks.has(task.id) && (
                          <button
                            onClick={() => handlePause(task)}
                            className="text-yellow-600 hover:underline"
                          >
                            Pause
                          </button>
                        )}

                      {/* Resume */}
                      {!task.completed &&
                        pausedTasks.has(task.id) && (
                          <button
                            onClick={() => handleResume(task)}
                            className="text-emerald-600 hover:underline"
                          >
                            Resume
                          </button>
                        )}


                      <button
                        onClick={() => handleCompleteToggle(task)}
                        className="text-emerald-600 hover:underline"
                      >
                        Toggle
                      </button>

                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => dispatch(removeTask(task.id))}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>


                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg space-y-4">
            <h3 className="text-xl font-semibold">Edit Task</h3>

            <input
              type="text"
              className="w-full border px-4 py-2 rounded-xl"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="w-full border px-4 py-2 rounded-xl"
              rows={3}
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-gray-300 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  dispatch(
                    editTask({
                      id: editingTask.id,
                      updates: {
                        title: editingTask.title,
                        description: editingTask.description,
                      },
                    })
                  );
                  setEditingTask(null);
                }}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default DashboardPage;


// <button
//   onClick={() => setEditingTask(task)}
//   className="text-blue-600 hover:underline"
// >
//   Edit
// </button>