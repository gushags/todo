/* ui.js */
import { format } from "date-fns";

const TODAY = "today";

export function renderToday(stored) {
  // render ui
  const today = document.querySelector("#today");
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

export function renderProjects(stored) {
  // render ui
  const projects = document.querySelector("#projects");
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

export function updateUI() {
  // update UI
}
