/* todos.js */

import { format, isToday, isFuture, formatDistanceToNow } from "date-fns";

// Create a project
export class Project {
  constructor(name, dueDate) {
    [
      (this.name = name),
      (this.id = generateID()),
      (this.createdDate = generateDate()),
      (this.dueDate = dueDate),
    ];
  }

  createToDo() {
    const newToDo = new ToDo();
    return newToDo;
  }
}

export class ToDo {
  constructor(title, description, priority, dueDate) {
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
}

function generateDate() {
  const date = format(new Date(), "PPP");
  return date;
}

function generateID() {
  const id = crypto.randomUUID();
  return id;
}

function toggleComplete() {
  this.complete ? (this.complete = false) : (this.complete = true);
  // call display function to change UI
}

function isDueSoon(dueDate) {
  if (isFuture(dueDate)) {
    const due = formatDistanceToNow(dueDate);
    if (due === "3 days" || due === "2 days" || due === "1 day") {
      return due;
      // UI update to show ToDo in yellow
    }
  }
}
