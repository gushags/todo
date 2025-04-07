/* project.js */
import { format, isToday, isFuture, formatDistanceToNow } from "date-fns";

// An individual project. Holds properties and behaviour for one project
class Project {
  constructor(name, dueDate) {
    this.name = name;
    this.id = generateID();
    this.createdDate = generateDate();
    this.dueDate = dueDate;
    this.todos = [];
  }

  newToDo(title, description, priority, dueDate) {
    let t = new ToDo(title, description, priority, dueDate);
    this.todos.push(t);
    return t;
  }
}

class ToDo {
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

// Class that holds a collection of projects and properties and functions for the group
export class Projects {
  constructor() {
    this.projects = [];
  }
  // create a new project and save it in the collection
  newProject(name) {
    let p = new Project(name);
    this.projects.push(p);
    return p;
  }
  // this could include anything
  get numberOfProjects() {
    return this.projects.length;
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

function isDueSoon(dueDate) {
  if (isFuture(dueDate)) {
    const due = formatDistanceToNow(dueDate);
    if (due === "3 days" || due === "2 days" || due === "1 day") {
      return due;
      // UI update to show ToDo in yellow
    }
  }
}

// function toggleComplete() {
//   this.complete ? (this.complete = false) : (this.complete = true);
//   // call display function to change UI
// }
