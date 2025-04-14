/* index.js */

/* css files */
import "./css-reset-josh.css";
import "./styles.css";

/* js modules */
import { Project } from "./projects.js";
import { assignToDoByProject } from "./localstorage.js";
import { renderProjects, renderToday } from "./ui.js";
import { inititalizeUI } from "./ui.js";

inititalizeUI();

// Use this to check if a session is already running, i.e., there is data in localstorage

// const allProjects = new Project();

// if (localStorage.length > 0) {
// console.log("You already have data.");
// let currProjectsToDos = assignToDoByProject();
// renderToday(currProjectsToDos);
// renderProjects(currProjectsToDos);
// localStorage.clear();
/*
    find projects in storedProjects by ID
    then use id to find name
    create new project by calling newProject
    then use data to correctly
    */
// } else {
//   // nothing is in storage yet

//   let today = allProjects.newProject("today");

//   today.newToDo(
//     "Sample ToDo",
//     "You can write a description here.",
//     "high",
//     new Date()
//   );
// }

// // Initialize form button
// const todayButton = document.querySelector("#today-button");
// todayButton.addEventListener("click", (event) => {
//   console.log(today);
//   event.preventDefault();
//   const title = document.querySelector('[name="todo-title"]').value;
//   const desc = document.querySelector('[name="todo-desc"]').value;
//   const priority = document.querySelector('[name="todo-priority"]').value;
//   const date = document.querySelector('[name="todo-date"]').value;

//   // This doesn't work because there is no newToDo function on the object
//   // I can't figure out how to get this function to work no matter if I
//   // put it in the above if statement or not
//   today.newToDo(title, desc, priority, date);

//   console.log(today);
// });

// Testing

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
