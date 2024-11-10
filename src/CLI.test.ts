import { assertSpyCall, stub } from "@std/testing/mock";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { CLI } from "./CLI.ts";
import { Logger } from "./Logger.ts";
import { MemoryStorage } from "./Storage.ts";
import { Task } from "./Task.ts";
import { TaskService } from "./TaskService.ts";

describe("CLI", () => {
  describe("execute", () => {
    let taskService: TaskService;
    let cli: CLI;

    beforeEach(() => {
      taskService = new TaskService(new MemoryStorage());
      cli = new CLI(taskService);
    });

    it("adds task", () => {
      const args = ["name", "add", "description"];
      const task = new Task(1, args[2], "todo", new Date(), new Date());
      using createStub = stub(taskService, "create", () => task);
      using loggerStub = stub(Logger, "log");

      cli.execute(args);

      assertSpyCall(createStub, 0, { args: [args[2]] });
      assertSpyCall(loggerStub, 0, {
        args: [`Task added successfully (ID: ${task.id})`],
      });
    });

    it("updates task", () => {
      const args = ["name", "update", "1", "description"];
      using updateStub = stub(taskService, "update");

      cli.execute(args);

      assertSpyCall(updateStub, 0, {
        args: [Number(args[2]), { description: args[3] }],
      });
    });

    it("deletes task", () => {
      const args = ["name", "delete", "1"];
      using deleteStub = stub(taskService, "delete");

      cli.execute(args);

      assertSpyCall(deleteStub, 0, {
        args: [Number(args[2])],
      });
    });

    it("marks task in progress", () => {
      const args = ["name", "mark-in-progress", "1"];
      using updateStub = stub(taskService, "update");

      cli.execute(args);

      assertSpyCall(updateStub, 0, {
        args: [Number(args[2]), { status: "in-progress" }],
      });
    });

    it("marks task done", () => {
      const args = ["name", "mark-done", "1"];
      using updateStub = stub(taskService, "update");

      cli.execute(args);

      assertSpyCall(updateStub, 0, {
        args: [Number(args[2]), { status: "done" }],
      });
    });

    it("lists tasks", () => {
      const args = ["name", "list"];
      const tasks: Task[] = [];
      using findStub = stub(taskService, "find", () => tasks);
      using loggerStub = stub(Logger, "table");

      cli.execute(args);

      assertSpyCall(findStub, 0, {
        args: [undefined],
      });
      assertSpyCall(loggerStub, 0, { args: [tasks] });
    });

    it("filters tasks", () => {
      const args = ["name", "list", "todo"];
      const tasks: Task[] = [];
      using findStub = stub(taskService, "find", () => tasks);
      using loggerStub = stub(Logger, "table");

      cli.execute(args);

      assertSpyCall(findStub, 0, {
        args: [args[2]],
      });
      assertSpyCall(loggerStub, 0, { args: [tasks] });
    });

    it("throws error on unknown command", () => {
      const args = ["name", "unknown"];
      const error = new Deno.errors.NotCapable();

      expect(() => cli.execute(args)).toThrow(error);
    });
  });
});
