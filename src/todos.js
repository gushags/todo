/* todos.js */

import { format, formatDistance, formatRelative, subDays } from "date-fns";

function createToDo({ title, description, complete, priority, dueDate }) {
  const todo = {
    title: title,
    description: description,
    complete: complete,
    priority: priority,
    createdDate: generateDate(),
    id: generateID(),
    dueDate: dueDate,
  };

  return {
    ...todo,
  };
}

function generateDate() {
  const date = format(new Date(), "PPP");
  return date;
}

function generateID() {
  const id = crypto.randomUUID();

  return id;
}

export { createToDo };
