import { assertSpyCall, stub } from "@std/testing/mock";
import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { FileStorage } from "./Storage.ts";
import { Task } from "./Task.ts";

describe("FileStorage", () => {
  describe(".read", () => {
    it("reads tasks file", () => {
      const task = new Task(1, "task", "todo", new Date(), new Date());
      using readFileStub = stub(
        Deno,
        "readTextFileSync",
        () => JSON.stringify([task]),
      );
      const storage = new FileStorage();

      const tasks = storage.read();

      assertSpyCall(readFileStub, 0, { args: ["./tasks.json"] });
      expect(tasks).toEqual([task]);
    });

    it("creates new file when file not found", () => {
      using readFileStub = stub(Deno, "readTextFileSync", () => {
        throw new Deno.errors.NotFound();
      });
      using writeFileStub = stub(Deno, "writeTextFileSync");
      const storage = new FileStorage();

      const tasks = storage.read();

      assertSpyCall(readFileStub, 0);
      assertSpyCall(writeFileStub, 0, {
        args: ["./tasks.json", JSON.stringify([])],
      });
      expect(tasks).toEqual([]);
    });

    it("throws error", () => {
      const error = new Error();
      using _readFileStub = stub(Deno, "readTextFileSync", () => {
        throw error;
      });
      const storage = new FileStorage();

      expect(() => storage.read()).toThrow(error);
    });
  });

  describe(".write", () => {
    it("writes tasks file", () => {
      using writeFileStub = stub(Deno, "writeTextFileSync");
      const tasks = [new Task(1, "task", "todo", new Date(), new Date())];
      const storage = new FileStorage();

      storage.write(tasks);

      assertSpyCall(writeFileStub, 0, {
        args: ["./tasks.json", JSON.stringify(tasks)],
      });
    });
  });
});
