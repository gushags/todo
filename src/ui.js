/* ui.js */
import { format } from "date-fns";
import { Project, generateDate, correctDate } from "./projects";
import { ToDo } from "./todos";

const TODAY = "today";
let allProjects = [];

const h1 = document.querySelector("h1");
const todayDate = generateDate();
h1.textContent = "Today — " + todayDate;

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
      let sampleDate = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);

      let todayProj = new Project(TODAY);
      let sampleProj = new Project("Sample Project", sampleDate);
      const todayTodo1 = new ToDo(
        "Please delete me",
        todayProj.id,
        "You can delete this TODO by clicking the 'X'. TODOs due today are green.",
        "High",
        new Date()
      );
      const todayTodo2 = new ToDo(
        "<-- Set this TODO as complete by clicking the checkbox",
        todayProj.id,
        "You can write a description here, too.",
        "Mid",
        new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000)
      );
      const todayTodo3 = new ToDo(
        "When a TODO is late, it turns red.",
        todayProj.id,
        "Better do this one quick. :-)",
        "Mid",
        new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
      );
      const sampleTodo = new ToDo(
        "Sample ToDo in Project",
        sampleProj.id,
        "You can write a description here. Delete this TODO by clicking the 'X'. Create a new one by clicking 'Add' above.",
        "Low",
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      );
      const sampleTodo2 = new ToDo(
        "This TODO is from another project",
        sampleProj.id,
        "If a TODO is due today, or is late, it will appear in both its project and the default Today project.",
        "Low",
        new Date()
      );

      todayProj.newToDo(todayTodo1);
      todayProj.newToDo(todayTodo2);
      todayProj.newToDo(todayTodo3);
      sampleProj.newToDo(sampleTodo);
      sampleProj.newToDo(sampleTodo2);
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
    if (stored[i].name === TODAY) {
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
        ol.dataset.isLate = stored[i].todos[j].isLate;
        ol.dataset.isToday = stored[i].todos[j].isToday;
        ol.dataset.complete = stored[i].todos[j].complete;
        divTop.classList.add("div-top");
        divMid.classList.add("div-mid");
        divBottom.classList.add("div-bottom");
        check.setAttribute("type", "checkbox");
        // set checkmark or bullet point based on complete status
        stored[i].todos[j].complete
          ? (check.checked = true)
          : (check.checked = false);
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
          todo.toggleComplete();
          console.log(todo);
          updateLocalStorage();
          renderToday(allProjects);
          ol.classList.add("complete");
        });
      }
    }
  }
  // Check if any TODOS in other projects are due today
  // or late and put them in Today
  for (let i = 0; i < stored.length; i++) {
    if (stored[i].name !== TODAY) {
      for (let j = 0; j < stored[i].todos.length; j++) {
        if (
          stored[i].todos[j].isToday === true ||
          stored[i].todos[j].isLate === true
        ) {
          let ol = document.createElement("ol");
          let check = document.createElement("input");
          let h4 = document.createElement("h4");
          let para = document.createElement("p");
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
          ol.dataset.isLate = stored[i].todos[j].isLate;
          ol.dataset.isToday = stored[i].todos[j].isToday;
          ol.dataset.complete = stored[i].todos[j].complete;
          divTop.classList.add("div-top");
          divMid.classList.add("div-mid");
          divBottom.classList.add("div-bottom");
          para.classList.add("from-project");
          check.setAttribute("type", "checkbox");
          // set checkmark or bullet point based on complete status
          stored[i].todos[j].complete
            ? (check.checked = true)
            : (check.checked = false);
          h4.textContent = stored[i].todos[j].title;
          para.textContent = "(from " + stored[i].name + ")";
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
          divTop.appendChild(para);
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
            todo.toggleComplete();
            console.log(todo);
            updateLocalStorage();
            renderToday(allProjects);
            ol.classList.add("complete");
          });
        }
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
      let div = document.createElement("div");
      let check = document.createElement("input");
      let h4 = document.createElement("h4");
      let date = document.createElement("p");
      let deleteBtn = document.createElement("button");
      ol.classList.add("project");
      ol.dataset.id = stored[i].id;
      ol.dataset.isDueSoon = stored[i].isDueSoon;
      ol.dataset.isLate = stored[i].isLate;
      ol.dataset.isToday = stored[i].isToday;
      ol.dataset.complete = stored[i].complete;
      stored[i].complete ? (check.checked = true) : (check.checked = false);
      div.classList.add("div-top");
      check.setAttribute("type", "checkbox");
      h4.textContent = stored[i].name;
      date.textContent = format(stored[i].dueDate, "P");
      deleteBtn.setAttribute("type", "submit");
      deleteBtn.classList.add("delete-button");
      deleteBtn.textContent = "X";

      ul.appendChild(ol);
      ol.appendChild(div);
      div.appendChild(check);
      div.appendChild(h4);
      div.appendChild(date);
      div.appendChild(deleteBtn);

      // Add event listeners
      h4.addEventListener("click", () => {
        displayProjectToDos(stored[i]);
      });

      check.addEventListener("click", () => {
        const proj = stored[i];
        proj.toggleComplete();
        updateLocalStorage();
        renderProjects(allProjects);
        ol.classList.add("complete");
      });

      deleteBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const projID = stored[i].id;
        deleteProject(projID);

        renderProjects(allProjects);
        updateLocalStorage();
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
    let divTop = document.createElement("div");
    let divMid = document.createElement("div");
    let divBottom = document.createElement("div");
    ol.classList.add("todo");
    ol.dataset.id = project.todos[i].id;
    ol.dataset.isDueSoon = project.todos[i].isDueSoon;
    ol.dataset.isLate = project.todos[i].isLate;
    ol.dataset.isToday = project.todos[i].isToday;
    ol.dataset.complete = project.todos[i].complete;
    divTop.classList.add("div-top");
    divMid.classList.add("div-mid");
    divBottom.classList.add("div-bottom");
    check.setAttribute("type", "checkbox");
    // set checkmark or bullet point based on complete status
    project.todos[i].complete
      ? (check.checked = true)
      : (check.checked = false);
    h4.textContent = project.todos[i].title;
    desc.textContent = project.todos[i].description;
    date.textContent = format(project.todos[i].dueDate, "PPP");
    priority.textContent = project.todos[i].priority;
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
      const proj = project;
      const todo = project.todos[i].id;
      deleteToDo(proj, todo);
      updateLocalStorage();
      displayProjectToDos(proj);
      renderToday(allProjects);
    });

    check.addEventListener("click", () => {
      const todo = project.todos[i];
      todo.toggleComplete();
      updateLocalStorage();
      displayProjectToDos(project);
      renderToday(allProjects);
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
      const correctedDate = correctDate(date);

      const todayToDo = new ToDo(title, proj, desc, priority, correctedDate);
      console.log(todayToDo);
      today.newToDo(todayToDo);
      console.log(today);

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
  const date = document.querySelector('[name="project-date"]').value;
  const correctedDate = correctDate(date);
  // Create new project and push to allProjects
  const project = new Project(title, correctedDate);
  console.log(project);
  allProjects.push(project);
  updateLocalStorage(); // Update storage to reflect change
  renderProjects(allProjects); // Update only Projects section

  const projectForm = document.getElementById("project-form");
  projectForm.reset();
  projectForm.classList.toggle("display-none");
});

// TODO form for inside new project
function createToDoForm() {
  const form = document.createElement("form");
  form.classList.add("display-none");
  form.id = "project-todos";

  const divTop = document.createElement("div");
  const divMid = document.createElement("div");
  const divThird = document.createElement("div");
  const divBottom = document.createElement("div");
  divTop.classList.add("div-top");
  divMid.classList.add("div-mid");
  divThird.classList.add("div-third");
  divBottom.classList.add("div-bottom");

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
    const correctedDate = correctDate(date);
    const projectToDo = new ToDo(title, projID, desc, priority, correctedDate);
    allProjects[projectIndex].newToDo(projectToDo);

    updateLocalStorage(); // Update storage to reflect change
    displayProjectToDos(allProjects[projectIndex]); // Update only Projects section
    renderToday(allProjects);
    form.reset();
  });

  // Append to form
  form.appendChild(divTop);
  divTop.appendChild(labelTitle);
  divTop.appendChild(inputTitle);
  form.appendChild(divMid);
  divMid.appendChild(labelDesc);
  divMid.appendChild(inputDesc);
  form.appendChild(divThird);
  divThird.appendChild(labelDate);
  divThird.appendChild(inputDate);
  form.appendChild(divBottom);
  divBottom.appendChild(labelPriority);
  divBottom.appendChild(inputPriority1);
  divBottom.appendChild(labelPriority1);
  divBottom.appendChild(inputPriority2);
  divBottom.appendChild(labelPriority2);
  divBottom.appendChild(inputPriority3);
  divBottom.appendChild(labelPriority3);
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
