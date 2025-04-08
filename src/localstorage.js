/* localstorage.js */
export function storageAvailable(type) {
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

export function storeToDo(todo) {
  const data = JSON.stringify(todo);
  localStorage.setItem(todo.id, data);
}

export function storeProject(project) {
  const data = JSON.stringify(project);
  localStorage.setItem(project.id, data);
}

export function getStorageByType(t) {
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

export function assembleProjects(storedProj) {
  let allProjects = [];
  for (let i = 0; i < storedProj.length; i++) {
    allProjects.push(storedProj[i]);
  }
  return allProjects;
}
