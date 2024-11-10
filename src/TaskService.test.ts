import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import type { Task } from "./Task.ts";
import { MemoryStorage } from "./Storage.ts";
import { TaskService } from "./TaskService.ts";

describe("TaskService", () => {
  let service: TaskService;

  beforeEach(() => {
    service = new TaskService(new MemoryStorage());
  });

  describe(".find", () => {
    it("returns all tasks", () => {
      expect(service.find()).toEqual([]);
    });

    it("returns filtered tasks", () => {
      const task1 = service.create("task 1");
      const task2 = service.create("task 2");
      service.update(task1.id, { status: "in-progress" });

      expect(service.find("in-progress")).toEqual([task1]);
      expect(service.find("todo")).toEqual([task2]);
    });

    it("throws error when filter not supported", () => {
      const filter = "unknown";
      const error = new Deno.errors.NotCapable(
        `List status filter not supported (${filter})`,
      );

      expect(() => service.find(filter)).toThrow(error);
    });
  });

  describe(".create", () => {
    it("creates task", () => {
      const initialTasks = service.find();
      const initialLength = initialTasks.length;
      const description = "test";

      service.create(description);

      const tasks = service.find();
      const task = tasks[0];

      expect(tasks).toHaveLength(initialLength + 1);
      expect(task.description).toBe(description);
      expect(task.status).toBe("todo");
    });
  });

  describe(".update", () => {
    it("updates task", () => {
      service.create("task 1");
      const tasks = service.find();
      const task = tasks[0];
      const initialLength = tasks.length;
      const initialCreatedAt = task.createdAt;
      const initialUpdatedAt = task.updatedAt;

      const update: Pick<Task, "description" | "status"> = {
        description: "new",
        status: "in-progress",
      };

      expect(update.description).not.toBe(task.description);
      expect(update.status).not.toBe(task.status);

      const updatedTask = service.update(task.id, update);

      expect(updatedTask.id).toBe(task.id);
      expect(updatedTask.description).toBe(update.description);
      expect(updatedTask.status).toBe(update.status);
      expect(updatedTask.createdAt).toBe(initialCreatedAt);
      expect(updatedTask.updatedAt).not.toBe(initialUpdatedAt);

      expect(service.find()).toHaveLength(initialLength);
    });

    it("throws error when task does not exist", () => {
      const nonExistingId = 1;
      expect(() => service.update(nonExistingId, {})).toThrow(
        `Task (ID: ${nonExistingId}) does not exist`,
      );
    });
  });

  describe(".delete", () => {
    it("deletes task", () => {
      service.create("task 1");
      const tasks = service.find();
      const initialLength = tasks.length;

      service.delete(tasks[0].id);

      expect(service.find()).toHaveLength(initialLength - 1);
    });

    it("throws error when task does not exist", () => {
      const nonExistingId = 1;
      expect(() => service.delete(nonExistingId)).toThrow(
        `Task (ID: ${nonExistingId}) does not exist`,
      );
    });
  });
});
