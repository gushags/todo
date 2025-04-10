/* localstorage.js */

export function storeToDo(todo) {
  const data = JSON.stringify(todo);
  localStorage.setItem(todo.id, data);
}

export function storeProject(project) {
  const data = JSON.stringify(project);
  localStorage.setItem(project.id, data);
}

function getStorageByType(t) {
  const data = [];
  if (localStorage.length) {
    for (let i = 0; i < localStorage.length; i++) {
      const item = JSON.parse(localStorage.getItem(localStorage.key(i)));
      data.push(item);
    }

    const items = data.filter((item) => {
      if (item.type === t) {
        return true; // keep it
      }
    });

    // return items;
    return items;
  } else {
    return false;
  }
}

// Always populate DOM from localstorage
export function assignToDoByProject() {
  const storedProjects = getStorageByType("project");
  const allProjects = assembleProjects(storedProjects);
  console.log("allProjects: " + allProjects[0].name);
  console.log("allProjects: " + allProjects[0].id);
  console.log("allProjects: " + allProjects[0].createdDate);
  console.log("allProjects: " + allProjects[0].dueDate);
  console.log("allProjects: " + allProjects[0].complete);
  console.log("allProjects: " + allProjects[0].isDueSoon);
  console.log("allProjects: " + allProjects[0].todos[0]);

  const storedTodos = getStorageByType("todo");
  for (let i = 0; i < allProjects.length; i++) {
    let test = allProjects[i].name;
    for (let j = 0; j < storedTodos.length; j++) {
      if (storedTodos[j].project === test) {
        allProjects[i].todos.push(storedTodos[j]);
      }
    }
  }
  return allProjects;
}

function assembleProjects(storedProj) {
  let allProjects = [];
  for (let i = 0; i < storedProj.length; i++) {
    allProjects.push(storedProj[i]);
  }
  return allProjects;
}
