/* ui.js */
import { format } from "date-fns";
import { Project } from "./projects";
import { ToDo } from "./todos";

const TODAY = "today";
let allProjects = [];

export function inititalizeUI() {
  // update UI
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
      sampleTodo.toggleComplete();

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

/**
 *
 * Render functions
 *
 */
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
        let check = document.createElement("input");
        let h4 = document.createElement("h4");
        let desc = document.createElement("p");
        let date = document.createElement("p");
        let priority = document.createElement("p");
        let deleteBtn = document.createElement("button");
        let divTop = document.createElement("div");
        let divMid = document.createElement("div");
        let divBottom = document.createElement("div");
        ol.classList.add("todo");
        ol.dataset.id = stored[i].todos[j].id;
        ol.dataset.isDueSoon = stored[i].todos[j].isDueSoon;
        ol.dataset.isToday = stored[i].todos[j].isToday;
        ol.dataset.complete = stored[i].todos[j].complete;
        divTop.classList.add("div-top");
        divMid.classList.add("div-mid");
        divBottom.classList.add("div-bottom");
        check.setAttribute("type", "checkbox");
        h4.textContent = stored[i].todos[j].title;
        desc.textContent = stored[i].todos[j].description;
        date.textContent = format(stored[i].todos[j].dueDate, "PPP");
        priority.textContent = stored[i].todos[j].priority;
        deleteBtn.setAttribute("type", "submit");
        deleteBtn.classList.add("delete-button");
        deleteBtn.textContent = "X";

        ul.appendChild(ol);
        ol.appendChild(divTop);
        divTop.appendChild(check);
        divTop.appendChild(h4);
        divTop.appendChild(deleteBtn);
        ol.appendChild(divMid);
        divMid.appendChild(desc);
        ol.appendChild(divBottom);
        divBottom.appendChild(date);
        divBottom.appendChild(priority);

        // Event listeners
        deleteBtn.addEventListener("click", (event) => {
          event.preventDefault();
          const project = stored[i];
          const todo = stored[i].todos[j].id;
          deleteToDo(project, todo);
          updateLocalStorage();
          renderToday(allProjects);
        });

        check.addEventListener("click", () => {
          const todo = stored[i].todos[j];
          console.log(todo);
          todo.toggleComplete();
          updateLocalStorage();
          renderToday(allProjects);
        });
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
      let check = document.createElement("input");
      let h4 = document.createElement("h4");
      let date = document.createElement("p");
      let deleteBtn = document.createElement("button");
      ol.classList.add("project");
      ol.dataset.id = stored[i].id;
      ol.dataset.isDueSoon = stored[i].isDueSoon;
      ol.dataset.isToday = stored[i].isToday;
      ol.dataset.complete = stored[i].complete;
      check.setAttribute("type", "checkbox");
      h4.textContent = stored[i].name;
      date.textContent = stored[i].dueDate;
      deleteBtn.setAttribute("type", "submit");
      deleteBtn.classList.add("delete-button");
      deleteBtn.textContent = "X";

      ul.appendChild(ol);
      ol.appendChild(check);
      ol.appendChild(h4);
      ol.appendChild(date);
      ol.appendChild(deleteBtn);

      // Add event listeners
      h4.addEventListener("click", () => {
        displayProjectToDos(stored[i]);
      });

      deleteBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const projID = stored[i].id;
        deleteProject(projID);
        updateLocalStorage();
        renderProjects(allProjects);
      });
    }
  }
}

function displayProjectToDos(project) {
  const projectDisplay = document.querySelector("#project-display");
  projectDisplay.classList.remove("display-none");
  projectDisplay.replaceChildren(); // Clear existing project todos
  let p = document.createElement("p");
  p.id = "project-todo-add";
  let ul = document.createElement("ul");
  let h3 = document.createElement("h3");
  h3.dataset.projectId = project.id;
  p.textContent = "Add ToDo...";
  const form = createToDoForm();
  h3.textContent = project.name;

  // Add listener to close todos by clicking on title
  h3.addEventListener("click", () => {
    projectDisplay.classList.toggle("display-none");
  });
  // Add listener to close todos by clicking on title
  p.addEventListener("click", () => {
    form.classList.toggle("display-none");
  });

  projectDisplay.appendChild(h3);
  projectDisplay.appendChild(p);
  projectDisplay.appendChild(form);
  projectDisplay.appendChild(ul);

  for (let i = 0; i < project.todos.length; i++) {
    let ol = document.createElement("ol");
    let check = document.createElement("input");
    let h4 = document.createElement("h4");
    let desc = document.createElement("p");
    let date = document.createElement("p");
    let priority = document.createElement("p");
    let deleteBtn = document.createElement("button");
    ol.classList.add("todo");
    ol.dataset.id = project.todos[i].id;
    ol.dataset.isDueSoon = project.todos[i].isDueSoon;
    ol.dataset.isToday = project.todos[i].isToday;
    ol.dataset.complete = project.todos[i].complete;
    check.setAttribute("type", "checkbox");
    h4.textContent = project.todos[i].title;
    desc.textContent = project.todos[i].description;
    date.textContent = format(project.todos[i].dueDate, "PPP");
    priority.textContent = project.todos[i].priority;
    deleteBtn.setAttribute("type", "submit");
    deleteBtn.classList.add("delete-button");
    deleteBtn.textContent = "X";

    ul.appendChild(ol);
    ol.appendChild(check);
    ol.appendChild(h4);
    ol.appendChild(desc);
    ol.appendChild(date);
    ol.appendChild(priority);
    ol.appendChild(deleteBtn);

    // Event listeners
    deleteBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const proj = project;
      const todo = project.todos[i].id;
      deleteToDo(proj, todo);
      updateLocalStorage();
      displayProjectToDos(proj);
    });
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

      updateLocalStorage(); // Update storage to reflect change
      renderToday(allProjects); // Update only Today section
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

// TODO form for inside new project
function createToDoForm() {
  const form = document.createElement("form");
  form.classList.add("display-none");
  form.id = "project-todos";

  const labelTitle = document.createElement("label");
  labelTitle.setAttribute("for", "projTodo-title");
  labelTitle.textContent = "To Do";

  const inputTitle = document.createElement("input");
  inputTitle.setAttribute("type", "text");
  inputTitle.setAttribute("name", "projTodo-title");
  inputTitle.required = true;

  const labelDesc = document.createElement("label");
  labelDesc.setAttribute("for", "projTodo-desc");
  labelDesc.textContent = "Description";

  const inputDesc = document.createElement("input");
  inputDesc.setAttribute("type", "text");
  inputDesc.setAttribute("name", "projTodo-desc");
  inputDesc.required = true;

  const labelDate = document.createElement("label");
  labelDate.setAttribute("for", "projTodo-date");
  labelDate.textContent = "Due Date";

  const inputDate = document.createElement("input");
  inputDate.setAttribute("type", "date");
  inputDate.setAttribute("name", "projTodo-date");
  inputDate.required = true;

  const labelPriority = document.createElement("label");
  labelPriority.setAttribute("for", "projTodo-priority");
  labelPriority.textContent = "Priority";

  const inputPriority1 = document.createElement("input");
  inputPriority1.setAttribute("type", "radio");
  inputPriority1.id = "low";
  inputPriority1.setAttribute("name", "projTodo-priority");
  inputPriority1.setAttribute("value", "low");
  inputPriority1.checked = true;

  const labelPriority1 = document.createElement("label");
  labelPriority1.setAttribute("for", "low");
  labelPriority1.textContent = "Low";

  const inputPriority2 = document.createElement("input");
  inputPriority2.setAttribute("type", "radio");
  inputPriority2.id = "mid";
  inputPriority2.setAttribute("name", "projTodo-priority");
  inputPriority2.setAttribute("value", "mid");

  const labelPriority2 = document.createElement("label");
  labelPriority2.setAttribute("for", "mid");
  labelPriority2.textContent = "Mid";

  const inputPriority3 = document.createElement("input");
  inputPriority3.setAttribute("type", "radio");
  inputPriority3.id = "high";
  inputPriority3.setAttribute("name", "projTodo-priority");
  inputPriority3.setAttribute("value", "high");

  const labelPriority3 = document.createElement("label");
  labelPriority3.setAttribute("for", "high");
  labelPriority3.textContent = "High";

  const projTodoBtn = document.createElement("button");
  projTodoBtn.id = "proj-todo-button";
  projTodoBtn.setAttribute("type", "submit");
  projTodoBtn.textContent = "Add";
  projTodoBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.querySelector('[name="projTodo-title"]').value;
    const h3 = document.querySelector("[data-project-id]");
    const projID = h3.dataset.projectId;
    // console.log(projID);
    const projectIndex = allProjects.findIndex((x) => x.id === projID);

    const desc = document.querySelector('[name="projTodo-desc"]').value;
    const priority = document.querySelector(
      '[name="projTodo-priority"]:checked'
    ).value;

    const date = document.querySelector('[name="projTodo-date"]').value;
    const projectToDo = new ToDo(title, projID, desc, priority, date);
    allProjects[projectIndex].newToDo(projectToDo);

    updateLocalStorage(); // Update storage to reflect change
    displayProjectToDos(allProjects[projectIndex]); // Update only Projects section

    form.reset();
  });

  // Append to form
  form.appendChild(labelTitle);
  form.appendChild(inputTitle);
  form.appendChild(labelDesc);
  form.appendChild(inputDesc);
  form.appendChild(labelDate);
  form.appendChild(inputDate);
  form.appendChild(labelPriority);
  form.appendChild(inputPriority1);
  form.appendChild(labelPriority1);
  form.appendChild(inputPriority2);
  form.appendChild(labelPriority2);
  form.appendChild(inputPriority3);
  form.appendChild(labelPriority3);
  form.appendChild(projTodoBtn);

  return form;
}

/**
 * Event controllers
 */

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

// Delete project function
function deleteProject(id) {
  const index = findProjectIndex(id);
  allProjects.splice(index, 1);
}

function findProjectIndex(id) {
  if (confirm("Delete this project?")) {
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i].id === id) {
        return i;
      }
    }
  }
}

// Delete TODO function
function deleteToDo(project, id) {
  if (confirm("Delete this ToDo?")) {
    const index = findToDoIndex(project, id);
    project.todos.splice(index, 1);
  }
}

function findToDoIndex(project, id) {
  for (let i = 0; i < project.todos.length; i++) {
    if (project.todos[i].id === id) {
      return i;
    }
  }
}
