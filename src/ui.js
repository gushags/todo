/* ui.js */
import { format } from "date-fns";
import { Project } from "./projects";
import { ToDo } from "./todos";

const TODAY = "today";
let allProjects = [];

export function inititalizeUI() {
  // update UI
  /*
   * Check if localstorage is enabled
   * -- Then check if "allProjects" there is already stored in localstorage
   * ---- If it is stored
   * ------ Get projects from localStorage
   * ------ Loop thru the stored JSON and create projects using fromJSON function
   * ------ Store those projects in allProjects array
   * ---- Else if data is not stored
   * ------ Create sample data to populate the DOM and save to allProjects
   * ------ Send the data to localstorage using updatedLocalStorage function
   *
   */
  if (storageAvailable("localStorage")) {
    const storedProjects = localStorage.getItem("allProjects");
    if (storedProjects) {
      // Get projects from local storage
      console.log("Getting data....");
      const jsonList = JSON.parse(storedProjects);
      const newProjectList = [];
      jsonList.forEach((projectRaw) => {
        const newProject = Project.fromJson(projectRaw);
        newProjectList.push(newProject);
      });
      allProjects = newProjectList;
      // See if I can get this to go into allProjects again

      updateLocalStorage();

      // Render default and projects to DOM
    } else {
      // Create default Today
      let todayProj = new Project(TODAY);
      let sampleProj = new Project("sample");
      const todayTodo1 = new ToDo(
        "Sample ToDo",
        todayProj.id,
        "You can write a description here.",
        "high",
        new Date()
      );
      const todayTodo2 = new ToDo(
        "Sample ToDo #2",
        todayProj.id,
        "You can write a description here, too.",
        "mid",
        new Date()
      );
      const sampleTodo = new ToDo(
        "Sample ToDo in Project",
        sampleProj.id,
        "You can write a description here, too.",
        "low",
        new Date()
      );

      todayProj.newToDo(todayTodo1);
      todayProj.newToDo(todayTodo2);
      sampleProj.newToDo(sampleTodo);
      allProjects = [todayProj, sampleProj];
      updateLocalStorage();
    }
  }
  renderToday(allProjects);
  renderProjects(allProjects);
}

function renderToday(stored) {
  // render ui
  const today = document.querySelector("#today-display");
  today.replaceChildren(); // Clear existing Today todos
  let ul = document.createElement("ul");
  today.appendChild(ul);
  // display Today ToDos in #today
  for (let i = 0; i < stored.length; i++) {
    if (stored[i].name === TODAY || stored[i].isToday) {
      for (let j = 0; j < stored[i].todos.length; j++) {
        let ol = document.createElement("ol");
        let h4 = document.createElement("h4");
        let desc = document.createElement("p");
        let date = document.createElement("p");
        let priority = document.createElement("p");
        ol.classList.add("todo");
        ol.dataset.id = stored[i].todos[j].id;
        ol.dataset.isDueSoon = stored[i].todos[j].isDueSoon;
        ol.dataset.isToday = stored[i].todos[j].isToday;
        ol.dataset.complete = stored[i].todos[j].complete;
        h4.textContent = stored[i].todos[j].title;
        desc.textContent = stored[i].todos[j].description;
        date.textContent = format(stored[i].todos[j].dueDate, "PPP");
        priority.textContent = stored[i].todos[j].priority;

        ul.appendChild(ol);
        ol.appendChild(h4);
        ol.appendChild(desc);
        ol.appendChild(date);
        ol.appendChild(priority);
      }
    }
  }
}

function renderProjects(stored) {
  // render ui
  const projects = document.querySelector("#projects-list");
  projects.replaceChildren();
  let ul = document.createElement("ul");
  projects.appendChild(ul);
  // display projects in #projects
  for (let i = 0; i < stored.length; i++) {
    if (stored[i].name !== TODAY) {
      let ol = document.createElement("ol");
      let h4 = document.createElement("h4");
      let date = document.createElement("p");
      ol.classList.add("project");
      ol.dataset.id = stored[i].id;
      ol.dataset.isDueSoon = stored[i].isDueSoon;
      ol.dataset.isToday = stored[i].isToday;
      ol.dataset.complete = stored[i].complete;
      h4.textContent = stored[i].name;
      date.textContent = stored[i].dueDate;

      ul.appendChild(ol);
      ol.appendChild(h4);
      ol.appendChild(date);

      // Add listener to populate projects's todos in #project-display
      ol.addEventListener("click", () => {
        displayProjectToDos(stored[i]);
      });
    }
  }
}

function displayProjectToDos(project) {
  const projectDisplay = document.querySelector("#project-display");
  projectDisplay.classList.remove("display-none");
  projectDisplay.replaceChildren(); // Clear existing project todos
  let ul = document.createElement("ul");
  let h3 = document.createElement("h3");
  h3.textContent = project.name;
  // Add listener to close todos by clicking on title
  h3.addEventListener("click", () => {
    projectDisplay.classList.toggle("display-none");
  });
  projectDisplay.appendChild(ul);
  ul.appendChild(h3);
  for (let i = 0; i < project.todos.length; i++) {
    let ol = document.createElement("ol");
    let h4 = document.createElement("h4");
    let desc = document.createElement("p");
    let date = document.createElement("p");
    let priority = document.createElement("p");
    ol.classList.add("todo");
    ol.dataset.id = project.todos[i].id;
    ol.dataset.isDueSoon = project.todos[i].isDueSoon;
    ol.dataset.isToday = project.todos[i].isToday;
    ol.dataset.complete = project.todos[i].complete;
    h4.textContent = project.todos[i].title;
    desc.textContent = project.todos[i].description;
    date.textContent = format(project.todos[i].dueDate, "PPP");
    priority.textContent = project.todos[i].priority;

    ul.appendChild(ol);
    ol.appendChild(h4);
    ol.appendChild(desc);
    ol.appendChild(date);
    ol.appendChild(priority);
  }
}

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * Update localStorage with the current projectList.
 * This function is only called when a change is made.
 */
function updateLocalStorage() {
  console.log("Updating localStorage...");
  if (storageAvailable("localStorage")) {
    localStorage.setItem("allProjects", JSON.stringify(allProjects));
  }
}

/**
 * Form controls
 */

// Initialize Today form button
const todayButton = document.querySelector("#today-button");
todayButton.addEventListener("click", (event) => {
  event.preventDefault();
  for (const project of allProjects) {
    if (project.name === TODAY) {
      const today = project;

      const title = document.querySelector('[name="todo-title"]').value;
      const proj = today.id;
      const desc = document.querySelector('[name="todo-desc"]').value;
      const priority = document.querySelector(
        '[name="todo-priority"]:checked'
      ).value;
      const date = document.querySelector('[name="todo-date"]').value;
      const todayToDo = new ToDo(title, proj, desc, priority, date);
      today.newToDo(todayToDo);

      renderToday(allProjects); // Update only Today section
      updateLocalStorage(); // Update storage to reflect change
      const todayForm = document.getElementById("today-form");
      todayForm.reset();
      todayForm.classList.toggle("display-none");
      //
    }
  }
});

// Initialize Project form button
const projectButton = document.querySelector("#project-button");
projectButton.addEventListener("click", (event) => {
  event.preventDefault();

  const title = document.querySelector('[name="project-title"]').value;
  const date = document.querySelector('[name="todo-date"]').value;
  // Create new project and push to allProjects
  const project = new Project(title, date);
  allProjects.push(project);

  renderProjects(allProjects); // Update only Projects section
  updateLocalStorage(); // Update storage to reflect change

  const projectForm = document.getElementById("project-form");
  projectForm.reset();
  projectForm.classList.toggle("display-none");
});

// Add Today TODO event listener
const todayAdd = document.querySelector("#today-add");
todayAdd.addEventListener("click", () => {
  const todayForm = document.querySelector("#today-form");
  todayForm.classList.toggle("display-none");
});

// Add Project event listener
const projectAdd = document.querySelector("#project-add");
projectAdd.addEventListener("click", () => {
  const projectAdd = document.querySelector("#project-form");
  projectAdd.classList.toggle("display-none");
});
