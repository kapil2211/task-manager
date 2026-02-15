const BASE_URL = "task-manager-iota-virid-33.vercel.app";

export const loginApi = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
};

export const getTasksApi = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

interface Task {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
}

export const createTaskApi = async (task: Task) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const updateTaskApi = async (id: string, updates: Partial<Task>) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

export const deleteTaskApi = async (id: string) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
};
