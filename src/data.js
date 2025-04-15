const chicken = new Project("Build Chicken House", "April 30, 2025");
const chickenToDo1 = new ToDo(
  "Get wood",
  chicken.id,
  "Lowe's would be a good place to get wood.",
  "high",
  "April 21, 2025"
);
const chickenToDo2 = new ToDo(
  "Find plans",
  chicken.id,
  "Check out Fine Chickenmaking",
  "high",
  "April 19, 2025"
);
chicken.newToDo(chickenToDo1);
chicken.newToDo(chickenToDo2);
newProjectList.push(chicken);
allProjects = newProjectList;
