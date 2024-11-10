import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { assertSpyCall, type MethodSpy, spy } from "@std/testing/mock";
import { Logger } from "./Logger.ts";

describe("Logger", () => {
  describe(".error", () => {
    let consoleSpy: MethodSpy;

    beforeEach(() => {
      consoleSpy = spy(console, "error");
    });

    afterEach(() => {
      consoleSpy.restore();
    });

    it("logs errors", () => {
      const error = new Error("test");
      Logger.error(error);

      assertSpyCall(consoleSpy, 0, { args: ["Error:", error.message] });
    });

    it("logs other parameters", () => {
      const notAnError = "not an error";
      Logger.error(notAnError);

      assertSpyCall(consoleSpy, 0, { args: ["Error:", notAnError] });
    });
  });

  describe(".log", () => {
    let consoleSpy: MethodSpy;

    beforeEach(() => {
      consoleSpy = spy(console, "log");
    });

    afterEach(() => {
      consoleSpy.restore();
    });

    it("logs passed parameter", () => {
      const message = "anything";
      Logger.log(message);

      assertSpyCall(consoleSpy, 0, { args: [message] });
    });
  });

  describe(".table", () => {
    let consoleSpy: MethodSpy;

    beforeEach(() => {
      consoleSpy = spy(console, "table");
    });

    afterEach(() => {
      consoleSpy.restore();
    });

    it("logs tabular data", () => {
      const data = "anything";
      Logger.table(data);

      assertSpyCall(consoleSpy, 0, { args: [data] });
    });
  });
});
