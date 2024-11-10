export class Task {
  static fromJson(value: Record<keyof Task, string | number>): Task {
    const task = new Task(
      Number(value.id),
      String(value.description),
      String(value.status) as Task["status"],
      new Date(value.createdAt),
      new Date(value.updatedAt),
    );

    task.validate();

    return task;
  }

  constructor(
    // A unique identifier for the task
    public id: number,
    // A short description of the task
    public description: string,
    // The status of the task (todo, in-progress, done)
    public status: "todo" | "in-progress" | "done",
    // The date and time when the task was created
    public createdAt: Date,
    // The date and time when the task was last updated
    public updatedAt: Date,
  ) {}

  protected validate(): boolean {
    return Object.entries(this).every(([key, value]) => {
      if (key === "updatedAt" && value instanceof Date && !isNaN(+value)) {
        return true;
      }
      if (key === "createdAt" && value instanceof Date && !isNaN(+value)) {
        return true;
      }
      if (key === "id" && typeof value === "number" && Number(value) > 0) {
        return true;
      }
      if (key === "description" && typeof value === "string") return true;
      if (
        key === "status" && typeof value === "string" &&
        ["todo", "in-progress", "done"].includes(value)
      ) {
        return true;
      }

      throw new Deno.errors.InvalidData(
        `Task is invalid (KEY: ${key}, VALUE: ${value}`,
      );
    });
  }
}
