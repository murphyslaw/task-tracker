export class Logger {
  static error(error: unknown): void {
    if (error instanceof Error) {
      console.error("Error:", error.message);

      return;
    }

    console.error("Error:", error);
  }

  static log(message: unknown): void {
    console.log(message);
  }

  static table(data: unknown): void {
    console.table(data);
  }
}
