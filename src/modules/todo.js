export class Todo {
  constructor(title, description, dueDate, priority = "normal", completed = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = this.toggleCompleted();
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}