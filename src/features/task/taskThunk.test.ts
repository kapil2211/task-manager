import { configureStore } from "@reduxjs/toolkit";
import taskReducer, {
  fetchTasks,
  addTask,
  removeTask,
  editTask,
} from "./taskSlice";

import * as taskApi from "../../api/taskapi";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("task thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  /* =========================
     FETCH TASKS
  ========================== */

  it("should fetch tasks successfully", async () => {
    const mockTasks = [
      {
        id: "1",
        title: "Test",
        description: "",
        completed: false,
        priority: "low",
        dueDate: "",
        createdAt: "",
      },
    ];

    vi.spyOn(taskApi, "getTasksApi").mockResolvedValue(mockTasks);

    const store = configureStore({
      reducer: { task: taskReducer },
    });

    await store.dispatch(fetchTasks());

    const state = store.getState().task;

    expect(state.tasks).toEqual(mockTasks);
    expect(state.loading).toBe(false);
  });

  it("should handle fetchTasks rejected", async () => {
    vi.spyOn(taskApi, "getTasksApi").mockRejectedValue(
      new Error("Fetch failed")
    );

    const store = configureStore({
      reducer: { task: taskReducer },
    });

    await store.dispatch(fetchTasks());

    const state = store.getState().task;

    expect(state.error).toBe("Fetch failed");
    expect(state.loading).toBe(false);
  });

  /* =========================
     ADD TASK
  ========================== */

  it("should add task successfully", async () => {
    const newTask = {
      id: "2",
      title: "New Task",
      description: "",
      completed: false,
      priority: "medium",
      dueDate: "",
      createdAt: "",
    };

    vi.spyOn(taskApi, "createTaskApi").mockResolvedValue(newTask);

    const store = configureStore({
      reducer: { task: taskReducer },
    });

    await store.dispatch(
      addTask({
        title: "New Task",
        description: "",
        priority: "medium",
        dueDate: "",
      })
    );

    const state = store.getState().task;

    expect(state.tasks).toContainEqual(newTask);
  });

  it("should handle addTask rejected", async () => {
    vi.spyOn(taskApi, "createTaskApi").mockRejectedValue(
      new Error("Add failed")
    );

    const store = configureStore({
      reducer: { task: taskReducer },
    });

    await store.dispatch(
      addTask({
        title: "Fail",
        description: "",
        priority: "low",
        dueDate: "",
      })
    );

    const state = store.getState().task;

    expect(state.error).toBe("Add failed");
  });

  /* =========================
     EDIT TASK
  ========================== */

  it("should edit task successfully", async () => {
    vi.spyOn(taskApi, "updateTaskApi").mockResolvedValue(undefined);

    const store = configureStore({
      reducer: { task: taskReducer },
      preloadedState: {
        task: {
          tasks: [
            {
              id: "4",
              title: "Old",
              description: "",
              completed: false,
              priority: "low" as const,
              dueDate: "",
              createdAt: "",
            },
          ],
          filter: "all" as const,
          loading: false,
          error: null,
        },
      },
    });

    await store.dispatch(
      editTask({
        id: "4",
        updates: { title: "Updated" },
      })
    );

    const state = store.getState().task;

    expect(state.tasks[0].title).toBe("Updated");
  });

  it("should handle editTask rejected", async () => {
    vi.spyOn(taskApi, "updateTaskApi").mockRejectedValue(
      new Error("Edit failed")
    );

    const store = configureStore({
      reducer: { task: taskReducer },
    });

    await store.dispatch(
      editTask({
        id: "100",
        updates: { title: "X" },
      })
    );

    const state = store.getState().task;

    expect(state.error).toBe("Edit failed");
  });

  it("should not update if task not found", async () => {
    vi.spyOn(taskApi, "updateTaskApi").mockResolvedValue(undefined);

    const store = configureStore({
      reducer: { task: taskReducer },
      preloadedState: {
        task: {
          tasks: [],
          filter: "all" as const,
          loading: false,
          error: null,
        },
      },
    });

    await store.dispatch(
      editTask({
        id: "999",
        updates: { title: "Nothing" },
      })
    );

    const state = store.getState().task;

    expect(state.tasks).toHaveLength(0);
  });

  /* =========================
     REMOVE TASK
  ========================== */

  it("should remove task successfully", async () => {
    vi.spyOn(taskApi, "deleteTaskApi").mockResolvedValue(undefined);

    const store = configureStore({
      reducer: { task: taskReducer },
      preloadedState: {
        task: {
          tasks: [
            {
              id: "3",
              title: "Delete",
              description: "",
              completed: false,
              priority: "low" as const,
              dueDate: "",
              createdAt: "",
            },
          ],
          filter: "all" as const,
          loading: false,
          error: null,
        },
      },
    });

    await store.dispatch(removeTask("3"));

    const state = store.getState().task;

    expect(state.tasks).toHaveLength(0);
  });

  it("should handle removeTask rejected", async () => {
    vi.spyOn(taskApi, "deleteTaskApi").mockRejectedValue(
      new Error("Delete failed")
    );

    const store = configureStore({
      reducer: { task: taskReducer },
    });

    await store.dispatch(removeTask("1"));

    const state = store.getState().task;

    expect(state.error).toBe("Delete failed");
  });
});
