import { Task } from "./Task.ts";

export interface IStorage {
  read: () => Task[];
  write: (tasks: Task[]) => void;
}

export class FileStorage implements IStorage {
  private file = "./tasks.json";

  read(): Task[] {
    let tasks: Task[] = [];

    try {
      const content = Deno.readTextFileSync(this.file);
      tasks = JSON.parse(content, (_, value) => {
        if (typeof value === "object") {
          if (Array.isArray(value)) return value;

          return Task.fromJson(value);
        }

        return value;
      });

      return tasks;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        this.write(tasks);
        return tasks;
      }

      throw error;
    }
  }

  write(tasks: Task[]): void {
    Deno.writeTextFileSync(this.file, JSON.stringify(tasks));
  }
}

export class MemoryStorage implements IStorage {
  private tasks: Task[] = [];

  read(): Task[] {
    return this.tasks;
  }

  write(tasks: Task[]): void {
    this.tasks = tasks;
  }
}
