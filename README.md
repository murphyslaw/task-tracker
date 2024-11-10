# Task Tracker

Task tracker is a command line tool used to track what you need to do, what you have done,
and what you are currently working on. Tasks are stored in JSON format in "./tasks.json" file.

This is an implementation of the [roadmap.sh "Task Tracker" project](https://roadmap.sh/projects/task-tracker).

## Installation

1. Clone repository

```sh
git clone git@github.com:murphyslaw/task-tracker.git
```

2. [Install Deno](https://docs.deno.com/runtime/getting_started/installation/)
3. Install dependencies

```sh
cd task-tracker
deno install
```

## Usage

List all tasks

```sh
./task-cli list
```

Add task

```sh
./task-cli add <description>
```

Update task

```sh
./task-cli update <task-id> <description>
```

Delete task

```sh
./task-cli delete <task-id>
```

List all "todo" tasks

```sh
./task-cli list todo
```

List all "in-progress" tasks

```sh
./task-cli list in-progress
```

List all "done" tasks

```sh
./task-cli list done
```

## Development

Run tests

```sh
deno test
```

Create and open coverage report

```sh
deno tasks coverage
```
