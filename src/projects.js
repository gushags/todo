/* project.js */
import { format, isToday, isFuture, formatDistanceToNow } from "date-fns";
import { ToDo } from "./todos.js";

// An individual project. Holds properties and behaviour for one project
export class Project {
  constructor(name, dueDate = "", todos = []) {
    this.type = "project";
    this.name = name;
    this.id = generateID();
    this.createdDate = generateDate();
    this.dueDate = dueDate;
    this.complete = false;
    this.isDueSoon = isDueSoon(this.dueDate);
    this.isToday = isToday(this.dueDate);
    this.todos = todos;
  }

  toggleComplete() {
    this.complete ? (this.complete = false) : (this.complete = true);
  }

  // Create ToDo from inside project
  newToDo(todo) {
    this.todos.push(todo);
  }

  static fromJson(stored) {
    const proj = new Project("temp");
    proj.name = stored.name;
    proj.id = stored.id;
    proj.active = stored.active;
    const todoList = [];
    stored.todos.forEach((todo) => {
      todoList.push(ToDo.fromJson(todo));
    });
    proj.todos = todoList;
    return proj;
  }
}

export function generateDate() {
  const date = format(new Date(), "PPP");
  return date;
}

export function generateID() {
  const id = crypto.randomUUID();
  return id;
}

export function isDueSoon(dueDate) {
  if (isFuture(dueDate)) {
    const due = formatDistanceToNow(dueDate);
    if (due === "3 days" || due === "2 days" || due === "1 day") {
      return true;
      // UI update to show ToDo in yellow
    } else {
      return false;
    }
  }
}

export function isLate(dueDate) {
  if (!isFuture(dueDate) && !isToday(dueDate)) {
    return true;
  } else {
    return false;
  }
}
