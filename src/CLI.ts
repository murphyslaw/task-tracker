import { Logger } from "./Logger.ts";
import { TaskService } from "./TaskService.ts";

export class CLI {
  constructor(private taskService: TaskService) {}

  execute(args: string[]): void {
    const command = args[1];

    switch (command) {
      case "add": {
        const description = args[2];
        const task = this.taskService.create(description);
        Logger.log(`Task added successfully (ID: ${task.id})`);

        break;
      }
      case "update": {
        const id = Number(args[2]);
        const description = args[3];

        this.taskService.update(id, { description });

        break;
      }
      case "delete": {
        const id = Number(args[2]);

        this.taskService.delete(id);

        break;
      }
      case "mark-in-progress": {
        const id = Number(args[2]);
        const status = "in-progress";

        this.taskService.update(id, { status });

        break;
      }
      case "mark-done": {
        const id = Number(args[2]);
        const status = "done";

        this.taskService.update(id, { status });

        break;
      }
      case "list": {
        const tasks = this.taskService.find(args[2]);
        Logger.table(tasks);

        break;
      }
      default: {
        throw new Deno.errors.NotCapable(
          `Command not supported (${command})`,
        );
      }
    }
  }
}
