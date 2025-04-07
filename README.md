# To Do App

# 1

Your ‘todos’ are going to be objects that you’ll want to dynamically create,
which means either using factories or constructors/classes to generate them.

# 2

Brainstorm what kind of properties your todo-items are going to have. At a
minimum they should have a title, description, dueDate and priority. You might
also want to include notes or even a checklist.

# 3

Your todo list should have projects or separate lists of todos. When a user
first opens the app, there should be some sort of ‘default’ project to which all
of their todos are put. Users should be able to create new projects and choose
which project their todos go into.

# 4

You should separate your application logic (i.e. creating new todos, setting
todos as complete, changing todo priority etc.) from the DOM-related stuff, so
keep all of those things in separate modules.

# 5

The look of the User Interface is up to you, but it should be able to do the
following:

- View all projects.
- View all todos in each project (probably just the title and duedate… perhaps
  changing color for different priorities).
- Expand a single todo to see/edit its details. Delete a todo.

# Two types of To Do

<!--
Today
|---- To Do
        |
        |---- Title
        |---- Decription
        |---- Checklist
        |---- Priority
        |---- Time ( All unfinished TODAY todos are moved to next day)
        |---- Due Date

Project
| ---- To Do
        |---- Title
        |---- Decription
        |---- Checklist
        |---- Priority
        |---- Due Date

-->
