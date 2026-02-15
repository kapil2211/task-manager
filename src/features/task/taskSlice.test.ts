import taskReducer, {
  setFilter,
  fetchTasks,
  addTask,
  editTask,
  removeTask,
} from "./taskSlice";

describe("taskSlice reducer", () => {
  const initialState = {
    tasks: [],
    filter: "all",
    loading: false,
    error: null,
  };

  it("should return initial state", () => {
    expect(taskReducer(undefined, { type: "" })).toEqual(initialState);
  });

  it("should handle setFilter", () => {
    const state = taskReducer(initialState, setFilter("completed"));
    expect(state.filter).toBe("completed");
  });

  it("should handle fetchTasks pending", () => {
    const action = { type: fetchTasks.pending.type };
    const state = taskReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it("should handle fetchTasks fulfilled", () => {
    const mockTasks = [
      {
        id: "1",
        title: "Test",
        description: "",
        completed: false,
        priority: "low",
        dueDate: "",
        createdAt: "2024-01-01",
      },
    ];

    const action = {
      type: fetchTasks.fulfilled.type,
      payload: mockTasks,
    };

    const state = taskReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.tasks.length).toBe(1);
  });

  it("should handle fetchTasks rejected", () => {
    const action = {
      type: fetchTasks.rejected.type,
      payload: "Error",
    };

    const state = taskReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error");
  });

  it("should handle addTask fulfilled", () => {
    const newTask = {
      id: "1",
      title: "New",
      description: "",
      completed: false,
      priority: "low",
      dueDate: "",
      createdAt: "2024-01-01",
    };

    const action = {
      type: addTask.fulfilled.type,
      payload: newTask,
    };

    const state = taskReducer(initialState, action);
    expect(state.tasks.length).toBe(1);
  });

  it("should handle editTask fulfilled", () => {
    const stateWithTask = {
      ...initialState,
      tasks: [
        {
          id: "1",
          title: "Old",
          description: "",
          completed: false,
          priority: "low",
          dueDate: "",
          createdAt: "2024-01-01",
        },
      ],
    };

    const action = {
      type: editTask.fulfilled.type,
      payload: {
        id: "1",
        updates: { title: "Updated" },
      },
    };

    const state = taskReducer(stateWithTask, action);
    expect(state.tasks[0].title).toBe("Updated");
  });

  it("should handle removeTask fulfilled", () => {
    const stateWithTask = {
      ...initialState,
      tasks: [
        {
          id: "1",
          title: "Task",
          description: "",
          completed: false,
          priority: "low",
          dueDate: "",
          createdAt: "2024-01-01",
        },
      ],
    };

    const action = {
      type: removeTask.fulfilled.type,
      payload: "1",
    };

    const state = taskReducer(stateWithTask, action);
    expect(state.tasks.length).toBe(0);
  });
});
