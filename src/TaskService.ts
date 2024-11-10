import type { IStorage } from "./Storage.ts";
import { Task } from "./Task.ts";

export class TaskService {
  private tasks: Task[];

  constructor(private storage: IStorage) {
    this.tasks = this.storage.read();
  }

  create(description: Task["description"]): Task {
    const now = this.currentDate;
    const task = new Task(this.nextId, description, "todo", now, now);

    this.tasks.push(task);

    this.storage.write(this.tasks);

    return task;
  }

  update(
    id: Task["id"],
    update: Partial<Pick<Task, "description" | "status">>,
  ): Task {
    const task = this.get(id);
    task.updatedAt = this.currentDate;

    Object.assign(task, update);
    this.storage.write(this.tasks);

    return task;
  }

  delete(id: Task["id"]): void {
    const index = this.findTaskIndexById(id);
    this.tasks.splice(index, 1);

    this.storage.write(this.tasks);
  }

  find(filter?: string): Task[] {
    if (filter && !this.isStatus(filter)) {
      throw new Deno.errors.NotCapable(
        `List status filter not supported (${filter})`,
      );
    }

    const result = this.tasks;

    if (filter) {
      return result.filter((task) => task.status === filter);
    }

    return result;
  }

  private get(id: Task["id"]): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new Deno.errors.NotFound(`Task (ID: ${id}) does not exist`);
    }

    return task;
  }

  private findTaskIndexById(id: Task["id"]): number {
    const index = this.tasks.findIndex((task) => task.id === id);

    if (index < 0) {
      throw new Deno.errors.NotFound(`Task (ID: ${id}) does not exist`);
    }

    return index;
  }

  private get currentDate() {
    return new Date();
  }

  private get nextId(): Task["id"] {
    return this.tasks.length
      ? Math.max(...this.tasks.map((task) => task.id)) + 1
      : 1;
  }

  private isStatus(arg: string): arg is Task["status"] {
    return ["todo", "in-progress", "done"].includes(arg);
  }
}
