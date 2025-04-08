/* index.js */

/* css files */
import "./css-reset-josh.css";
import "./styles.css";

/* js modules */

import { Projects } from "./projects.js";

// Testing

let allProjects = new Projects();
let today = allProjects.newProject("today");
console.log(today);

const jeff = allProjects.newProject("Jeff");
const amber = allProjects.newProject("Amber");

jeff.newToDo("Party", "Lorem ipsum", null, "Sun Apr 06 2025 08:19:12 GMT-0700");
jeff.newToDo("Jump", "Lorem ipsum", null, "Sun Apr 06 2025 08:19:12 GMT-0700");
amber.newToDo("Dog", "Lorem ipsum", null, "Sun Apr 06 2025 08:19:12 GMT-0700");

console.log(jeff);
// console.log(jeff.todos.length);
// console.log(allProjects.projects);
// console.log(allProjects.projects[2].todos[0]);
// console.log(allProjects.projects[1].id);
// console.log(allProjects.numberOfProjects);
// deleteToDo(jeff, jeff.todos[0].id);
// console.log(jeff);

// Delete project function
function deleteProject(id) {
  const index = findProjectIndex(id);
  allProjects.projects.splice(index, 1);
}

function findProjectIndex(id) {
  for (let i = 0; i < allProjects.numberOfProjects; i++) {
    if (allProjects.projects[i].id === id) {
      return i;
    }
  }
}

function deleteToDo(project, id) {
  const index = findToDoIndex(project, id);
  project.todos.splice(index, 1);
}

function findToDoIndex(project, id) {
  for (let i = 0; i < project.todos.length; i++) {
    if (project.todos[i].id === id) {
      return i;
    }
  }
}

/*
Use modules, factory functions, compositino to create todos and projects

What do we need to be able to do with the ToDos?
-- create them
-- delete them
-- assign them different priority
-- created date
-- assign them due dates
-- check if they are due soon, due today, or late


// ToDo functions
function createToDo
    title
    description
    Complete
    Priority
    Due Date
    Delete


// Project function
function createProject
    -- A project has an array of associated ToDos.
    name
    description
    priority (optional)
    due date (optional)
    Delete

Today is a special project that has its own ToDos but can also reflect either ToDos that someone places in it or ToDos that are due today in another project.

It is a project with extra functionality that can *display* ToDos from any other project



// Moving ToDos functions
function moveToTommorow
    -- move a today ToDo to tomorrow

function moveToToday
    -- copy any ToDo into Today


// Date Functions
function checkDeadline
    -- Calls isDueSoon
    -- Calls isDueToday
    -- Calls isLate

---> Used by CheckDeadline
function isDueSoon
    -- checks if the DueDate on the ToDo is close to expiring
    -- if due in 3 days or less, adds yellow background to ToDo

function isDueToday
    -- checks if the DueDate on the ToDo is due today
    -- adds ToDo to Today's project array
    -- adds green background to ToDo

function isLate
    -- checks if the DueDate on the ToDo is late
    -- adds red background to ToDo
<---

*/
