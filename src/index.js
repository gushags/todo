/* index.js */

/* css files */
import "./css-reset-josh.css";
import "./styles.css";

/* js modules */
import { Projects } from "./projects.js";
import { assignToDoByProject } from "./localstorage.js";
import { renderProjects, renderToday } from "./ui.js";

// Use this to check if a session is already running, i.e., there is data in localstorage

if (localStorage.length > 0) {
  console.log("You already have data.");
  let currProjectsToDos = assignToDoByProject();
  renderToday(currProjectsToDos);
  renderProjects(currProjectsToDos);
} else {
  // nothing is in storage yet
  let allProjects = new Projects();
  console.log(allProjects); // find out if newToDo is here
  let today = allProjects.newProject("today");
  const jeff = allProjects.newProject("Jeff");
  const amber = allProjects.newProject("Amber");

  today.newToDo(
    "Party",
    "Lorem ipsum",
    "high",
    "Sun Apr 06 2025 08:19:12 GMT-0700"
  );
  today.newToDo(
    "Sleep",
    "Lorem ipsum ipsum ipsum nu",
    "low",
    "Sun Apr 06 2025 08:19:12 GMT-0700"
  );
  jeff.newToDo(
    "Party",
    "Lorem ipsum",
    "mid",
    "Sun Apr 06 2025 08:19:12 GMT-0700"
  );
  jeff.newToDo(
    "Jump",
    "Lorem ipsum",
    "low",
    "Sun Apr 06 2025 08:19:12 GMT-0700"
  );
  amber.newToDo(
    "Dog",
    "Lorem ipsum",
    "high",
    "Sun Apr 06 2025 08:19:12 GMT-0700"
  );
  currProjectsToDos = assignToDoByProject();
  renderToday(currProjectsToDos);
  renderProjects(currProjectsToDos);
  console.log(currProjectsToDos);

  // Initialize forms
}

const todayButton = document.querySelector("#today-button");
todayButton.addEventListener("click", (event) => {
  console.log(today);
  event.preventDefault();
  const title = document.querySelector('[name="todo-title"]').value;
  const desc = document.querySelector('[name="todo-desc"]').value;
  const priority = document.querySelector('[name="todo-priority"]').value;
  const date = document.querySelector('[name="todo-date"]').value;

  // This doesn't work because there is no newToDo function on the object
  // I can't figure out how to get this function to work no matter if I
  // put it in the above if statement or not
  today.newToDo(title, desc, priority, date);

  console.log(today);
});

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
