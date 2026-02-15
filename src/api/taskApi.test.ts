import {
    getTasksApi,
    createTaskApi,
    updateTaskApi,
    deleteTaskApi,
} from "./taskapi";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("taskApi (fetch)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should fetch tasks", async () => {
        const mockTasks = [{ id: "1", title: "Test" }];

        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTasks),
            } as Response)
        ));

        const result = await getTasksApi();

        expect(result).toEqual(mockTasks);
    });

    it("should create task", async () => {
        const newTask = { id: "1", title: "New Task" };

        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(newTask),
            } as Response)
        ));

        const result = await createTaskApi(newTask);

        expect(result).toEqual(newTask);
    });

    it("should update task", async () => {
        const updatedTask = { id: "1", title: "Updated" };

        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(updatedTask),
            } as Response)
        ));

        const result = await updateTaskApi("1", { title: "Updated" });

        expect(result).toEqual(updatedTask);
    });

    it("should delete task", async () => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            } as Response)
        ));

        const result = await deleteTaskApi("1");

        expect(result).toEqual({ success: true });
    });

    it("should throw error if fetch fails", async () => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: false,
            } as Response)
        ));

        await expect(getTasksApi()).rejects.toThrow();
    });

    it("should throw error if create fails", async () => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: false,
            } as Response)
        ));

        const invalidTask: {
            title: string;
            description: string;
            priority: "low" | "medium" | "high";
            dueDate: string;
        } = {
            title: "",
            description: "",
            priority: "low",
            dueDate: "",
        };

        await expect(createTaskApi(invalidTask)).rejects.toThrow();
    });

    it("should throw error if update fails", async () => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: false,
            } as Response)
        ));

        await expect(
            updateTaskApi("1", { title: "Updated" })
        ).rejects.toThrow();
    });

    it("should throw error if delete fails", async () => {
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
                ok: false,
            } as Response)
        ));

        await expect(deleteTaskApi("1")).rejects.toThrow();
    });

    it("should throw error if fetch tasks fails", async () => {
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
      ok: false,
    } as Response)
  ));

  await expect(getTasksApi()).rejects.toThrow();
});

it("should throw error if create task fails", async () => {
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
      ok: false,
    } as Response)
  ));

  await expect(createTaskApi({ id: "1", title: "Test" }))
    .rejects
    .toThrow();
});


});