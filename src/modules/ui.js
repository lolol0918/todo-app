import { Todo } from "./todo.js";

export class UI {
    constructor(projectManager) {
        this.pm = projectManager;
    }

    // bind all using init()
    init() {
        this.renderProjects();
    }

    // showTaskForm

    // create task
    showTaskForm() {
        const title = prompt("Enter task title:");
        const description = prompt("Enter description:");
        const dueDate = prompt("Enter due date (YYYY-MM-DD):");
        const priority = prompt("Enter priority (low/normal/high):");

        const todo = new Todo(title, description, dueDate, priority);

        this.pm.addTodoToProject(this.pm.currentProjectId, todo);
        this.renderTasks();
    }

    // show project form
    createProject() {
        const name = prompt("Enter project name:");
        const description = prompt("Enter project description:");

        const project = this.pm.addProject(name, description);
        this.renderProjects();
    }

    // render projects
    renderProjects() {
        const projectContainer = document.getElementById("projects-container");
        projectContainer.innerHTML = ``; // clear old projects

        this.pm.projects.forEach(project => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("project-item");

            // project button
            const projectBtn = document.createElement("button");
            projectBtn.classList.add("project-btn");
            projectBtn.textContent = project.name;

            projectBtn.addEventListener("click", () => {
                this.pm.currentProjectId = project.id;
                console.log(`Switched to project: ${project.name}`);
                this.renderTasks();
            });

            // delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            deleteBtn.innerHTML = "<i class='bx bx-trash'></i>";

            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.pm.deleteProject(project.id);
                this.renderProjects();
            });

            wrapper.appendChild(projectBtn);
            wrapper.appendChild(deleteBtn);

            projectContainer.appendChild(wrapper);
        });
    }

    renderTasks() {
        const project = this.pm.getProject(this.pm.currentProjectId);
        const taskContainer = document.getElementById("task-container");

        project.todos.forEach(todo => {
            const div = document.createElement("div");
            div.classList.add("task");
            div.innerHTML = `
        <strong>${todo.title}</strong><br>
        <small>${todo.description}</small><br>
        Due: ${todo.dueDate} | Priority: ${todo.priority}
    `;

            taskContainer.appendChild(div);
        })
    }
}