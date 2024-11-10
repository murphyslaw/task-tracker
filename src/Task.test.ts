import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Task } from "./Task.ts";

describe("Task", () => {
  it("provides id", () => {
    const id = 1;
    const task = new Task(id, "task", "todo", new Date(), new Date());

    expect(task.id).toBe(id);
  });

  it("provides description", () => {
    const description = "task";
    const task = new Task(1, description, "todo", new Date(), new Date());

    expect(task.description).toBe(description);
  });

  it("provides status", () => {
    const status = "todo";
    const task = new Task(1, "task", status, new Date(), new Date());

    expect(task.status).toBe(status);
  });

  it("provides createdAt", () => {
    const createdAt = new Date();
    const task = new Task(1, "task", "todo", createdAt, new Date());

    expect(task.createdAt).toBe(createdAt);
  });

  it("provides updatedAt", () => {
    const updatedAt = new Date();
    const task = new Task(1, "task", "todo", new Date(), updatedAt);

    expect(task.updatedAt).toBe(updatedAt);
  });

  describe(".fromJson", () => {
    it("throw error when task is invalid", () => {
      const invalidId = -5;
      const value = {
        id: invalidId,
        description: "task 1",
        status: "todo",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(() => Task.fromJson(value)).toThrow(
        `Task is invalid (KEY: id, VALUE: ${invalidId}`,
      );
    });
  });
});
