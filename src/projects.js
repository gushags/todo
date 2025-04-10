/* project.js */
import { format, isToday, isFuture, formatDistanceToNow } from "date-fns";
import { ToDo } from "./todos.js";

// An individual project. Holds properties and behaviour for one project
class Project {
  constructor(name, dueDate, todos = []) {
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

  toJson() {
    return JSON.stringify(this);
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

// Class that holds a collection of projects and properties and functions for the group
// export class Projects {
//   constructor() {
//     this.projects = [];
//   }
//   // create a new project and save it in the collection
//   newProject(name) {
//     let p = new Project(name);
//     this.projects.push(p);
//     storeProject(p); // Store in localstorage
//     return p;
//   }
//   // this could include anything
//   get numberOfProjects() {
//     return this.projects.length;
//   }
// }

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
