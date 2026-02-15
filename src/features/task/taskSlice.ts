import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../../api/taskapi";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
  filter: "all" | "pending" | "completed";
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  filter: "all",
  loading: false,
  error: null,
};

/* ========================
   🔥 ASYNC THUNKS
======================== */

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      return await getTasksApi();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (
    task: {
      title: string;
      description: string;
      priority: "low" | "medium" | "high";
      dueDate: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await createTaskApi(task);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (
    { id, updates }: { id: string; updates: Partial<Task> },
    { rejectWithValue }
  ) => {
    try {
      await updateTaskApi(id, updates);
      return { id, updates };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTaskApi(id);
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return rejectWithValue(message);
    }
  }
);

/* ========================
   🎯 SLICE
======================== */

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: {
        payload: "all" | "pending" | "completed";
      }
    ) => {
      state.filter = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH TASKS */
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* ADD TASK */
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      /* EDIT TASK */
      .addCase(editTask.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const task = state.tasks.find((t) => t.id === id);
        if (task) {
          Object.assign(task, updates);
        }
      })

      /* DELETE TASK */
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        );
      });
  },
});

export const { setFilter } = taskSlice.actions;

export default taskSlice.reducer;
