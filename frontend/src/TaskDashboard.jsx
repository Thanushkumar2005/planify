import { useEffect, useState } from "react";
import API from "./api";

function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueAt, setNewTaskDueAt] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Auto-complete tasks when due time is over
  useEffect(() => {
    const checkDueTasks = () => {
      const now = new Date();
      tasks.forEach(async (task) => {
        if (!task.completed && task.dueAt && new Date(task.dueAt) < now) {
          try {
            await API.put(`/tasks/${task._id}`);
            fetchTasks();
          } catch (err) {
            console.error("Failed to auto-complete task:", err);
          }
        }
      });
    };

    const interval = setInterval(checkDueTasks, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/tasks");
      setTasks(response.data || []);
    } catch (err) {
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (!newTaskText.trim()) {
      setError("Please enter a task description.");
      return;
    }

    setIsCreating(true);
    setError("");

    // Combine date and time into dueAt
    let dueAt = null;
    if (selectedDate && selectedTime) {
      dueAt = new Date(`${selectedDate}T${selectedTime}`).toISOString();
    }

    try {
      await API.post("/tasks", {
        text: newTaskText.trim(),
        description: newTaskDescription.trim(),
        dueAt,
      });
      setNewTaskText("");
      setNewTaskDescription("");
      setSelectedDate("");
      setSelectedTime("");
      await fetchTasks();
    } catch (err) {
      setError("Unable to add task. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    setError("");

    try {
      await API.put(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      setError("Unable to update task status. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setError("");

    try {
      await API.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (err) {
      setError("Unable to delete task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-fuchsia-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-sky-400/30 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-fuchsia-400/40 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}></div>
        <div className="absolute top-1/3 right-10 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4.5s'}}></div>
      </div>

      <div className="mx-auto w-full max-w-5xl rounded-[2rem] bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 border border-slate-700/50 shadow-2xl shadow-slate-950/40 backdrop-blur-lg p-8 relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            {/* Animated gradient text effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 opacity-20 blur-xl animate-pulse"></div>
            <p className="relative text-sm uppercase tracking-[0.3em] bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent font-bold animate-pulse">
              ✨ Planify Dashboard
            </p>
            <h1 className="relative mt-3 text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent animate-fade-in">
              Welcome back, <span className="bg-gradient-to-r from-sky-300 to-fuchsia-300 bg-clip-text text-transparent">{user?.name || user?.email}</span>
            </h1>
            <p className="relative mt-2 text-slate-400 text-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
              "Success is the sum of small efforts, repeated day in and day out." <span className="text-sky-400">🚀</span>
            </p>

            {/* Decorative line */}
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-sky-400 to-fuchsia-400 rounded-full animate-slide-in" style={{animationDelay: '0.4s'}}></div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Date and Time Display */}
            <div className="flex gap-3">
              {/* Calendar - Date */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 backdrop-blur-sm animate-slide-in" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Date</div>
                    <div className="text-sm font-semibold text-white">
                      {currentTime.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clock - Time */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-sm animate-slide-in" style={{animationDelay: '0.6s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Time</div>
                    <div className="text-sm font-semibold text-white font-mono">
                      {currentTime.toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated sign out button */}
            <button
              onClick={onLogout}
              className="group relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:from-slate-200 hover:to-slate-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-400/25 transform"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-400/20 to-fuchsia-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Stats card */}
            <div className="bg-gradient-to-r from-sky-500/10 to-fuchsia-500/10 border border-sky-500/20 rounded-2xl p-4 backdrop-blur-sm animate-slide-in" style={{animationDelay: '0.7s'}}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{tasks.length}</div>
                <div className="text-sm text-slate-400 uppercase tracking-wide">Active Tasks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-950/90 to-slate-900/80 backdrop-blur-sm p-6 shadow-inner animate-fade-in" style={{animationDelay: '0.8s'}}>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Tasks</h2>
                <p className="mt-1 text-sm text-slate-400">Fetched live from the backend API • <span className="text-sky-400">Real-time updates</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gradient-to-r from-sky-500/15 to-indigo-500/15 border border-sky-500/20 px-4 py-2 text-sm text-sky-200 font-medium animate-pulse">
                {tasks.length} items
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <form onSubmit={handleAddTask} className="mb-6 space-y-3 rounded-3xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
              <input
                type="text"
                value={newTaskText}
                onChange={(event) => setNewTaskText(event.target.value)}
                placeholder="Task title"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-sky-400"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-sky-400"
                />
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-sky-400"
                />
              </div>
            </div>

            {/* Date/Time Banner */}
            {(selectedDate || selectedTime) && (
              <div className="rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 p-4 backdrop-blur-sm animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Selected Due Date & Time</div>
                    <div className="text-sm font-semibold text-white">
                      {selectedDate && selectedTime
                        ? new Date(`${selectedDate}T${selectedTime}`).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })
                        : selectedDate
                        ? new Date(selectedDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : selectedTime
                        ? `Time: ${new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}`
                        : 'No date/time selected'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            <textarea
              value={newTaskDescription}
              onChange={(event) => setNewTaskDescription(event.target.value)}
              placeholder="Task description"
              rows={3}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-1 ring-transparent transition focus:border-sky-400 focus:ring-sky-400"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
            >
              {isCreating ? "Adding task..." : "Add task"}
            </button>
          </form>

          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              Loading tasks...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-200">
              {error}
            </div>
          ) : tasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
              No tasks found. Add tasks using the form above.
            </div>
          ) : (
            <div className="space-y-8">
              {/* Active Tasks */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Active Tasks</h3>
                {tasks.filter(task => !task.completed).length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
                    No active tasks.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {tasks.filter(task => !task.completed).map((task) => (
                      <div
                        key={task._id}
                        onClick={() => handleToggleTask(task._id)}
                        className="cursor-pointer rounded-3xl border border-slate-700 bg-slate-950/80 p-5 transition hover:-translate-y-1 hover:border-sky-500/30"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-white">Task</h3>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-slate-700/80 text-slate-300">
                              Click to complete
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task._id);
                              }}
                              className="rounded-full p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete task"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="mt-4 text-slate-300">{task.text}</p>
                        {task.description ? (
                          <p className="mt-3 text-sm text-slate-400">{task.description}</p>
                        ) : null}
                        {task.dueAt ? (
                          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-sky-400">
                            Due: {new Date(task.dueAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        ) : null}
                        {task.file && (
                          <p className="mt-3 text-xs text-emerald-400">
                            File: {task.file.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Tasks */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Completed Tasks</h3>
                {tasks.filter(task => task.completed).length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center text-slate-400">
                    No completed tasks.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {tasks.filter(task => task.completed).map((task) => (
                      <div
                        key={task._id}
                        onClick={() => handleToggleTask(task._id)}
                        className="cursor-pointer rounded-3xl border border-slate-700 bg-slate-950/80 p-5 transition hover:-translate-y-1 hover:border-emerald-500/30 opacity-75"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold text-white">Task</h3>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/15 text-emerald-200">
                              Completed
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task._id);
                              }}
                              className="rounded-full p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete task"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="mt-4 text-slate-300 line-through">{task.text}</p>
                        {task.description ? (
                          <p className="mt-3 text-sm text-slate-400">{task.description}</p>
                        ) : null}
                        {task.dueAt ? (
                          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-sky-400">
                            Due: {new Date(task.dueAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        ) : null}
                        {task.file && (
                          <p className="mt-3 text-xs text-emerald-400">
                            File: {task.file.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDashboard;
