import { http, HttpResponse } from "msw";
 import { delay } from "msw";

interface LoginRequestBody {
  username: string;
  password: string;
}

interface TaskRequestBody {
  title: string;
  description?: string;
}

interface Task extends TaskRequestBody {
  id: string;
  completed: boolean;
  createdAt: string;
}



let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

const saveTasks = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const handlers = [
  http.post("/login", async ({ request }) => {
    const body = (await request.json()) as LoginRequestBody;

    const { username, password } = body;

    if (username === "test@test.com" && password === "123456") {
      return HttpResponse.json(
        { token: "fake-jwt-token" },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),


  

http.get("/api/tasks", async () => {
  await delay(1200);
  return HttpResponse.json(tasks);
}),

  http.post("/api/tasks", async ({ request }) => {
    const newTask = await request.json() as TaskRequestBody;

    const task = {
      ...newTask,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.push(task);
    saveTasks();

    return HttpResponse.json(task);
  }),

  http.put("/api/tasks/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json() as TaskRequestBody;

    tasks = tasks.map((t: Task) =>
      t.id === id ? { ...t, ...updates } : t
    );

    saveTasks();

    return HttpResponse.json({ success: true });
  }),

  http.delete("/api/tasks/:id", ({ params }) => {
    const { id } = params;

    tasks = tasks.filter((t: Task) => t.id !== id);
    saveTasks();

    return HttpResponse.json({ success: true });
  }),
];


