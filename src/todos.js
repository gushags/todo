/* todos.js */
// Individual ToDo
export class ToDo {
  constructor(
    title,
    project,
    description = "",
    priority = "low",
    dueDate = ""
  ) {
    this.type = "todo";
    this.project = project;
    this.id = generateID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.complete = false;
    this.createdDate = generateDate();
    this.dueDate = dueDate;
    this.isDueSoon = isDueSoon(this.dueDate);
    this.isToday = isToday(this.dueDate);
  }

  toggleComplete() {
    this.complete ? (this.complete = false) : (this.complete = true);
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(stored) {
    return new ToDo(
      stored.title,
      stored.project,
      stored.description,
      stored.priority,
      new Date(stored.dueDate)
    );
  }
}
