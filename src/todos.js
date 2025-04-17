/* todos.js */
// Individual ToDo
import { isToday } from "date-fns";

import { generateID, generateDate, isDueSoon, isLate } from "./projects";

export class ToDo {
  constructor(
    title,
    project,
    description = "",
    priority = "low",
    dueDate = "",
    complete = false
  ) {
    this.type = "todo";
    this.project = project;
    this.id = generateID();
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.complete = complete;
    this.createdDate = generateDate();
    this.dueDate = dueDate;
    this.isDueSoon = isDueSoon(this.dueDate);
    this.isLate = isLate(this.dueDate);
    this.isToday = isToday(this.dueDate);
  }

  toggleComplete() {
    this.complete ? (this.complete = false) : (this.complete = true);
  }

  static fromJson(stored) {
    return new ToDo(
      stored.title,
      stored.project,
      stored.description,
      stored.priority,
      stored.dueDate,
      stored.complete
    );
  }
}
