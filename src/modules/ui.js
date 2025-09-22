import { Todo } from "./todo.js";

export class UI {
    constructor(projectManager) {
        this.pm = projectManager;
    }

    // bind all using init()

    // showTaskForm

    // create task
    showTaskForm() {
        const title = prompt("Enter task title:");
        const description = prompt("Enter description:");
        const dueDate = prompt("Enter due date (YYYY-MM-DD):");
        const priority = prompt("Enter priority (low/normal/high):");

        const todo = new Todo(title, description, dueDate, priority);

        this.pm.addTodoToProject(this.pm.currentProjectId, todo);
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
            const btn = document.createElement("button");
            btn.classList.add("project-btn");
            btn.textContent = project.name;

            // change current project on click
            btn.addEventListener("click", () => {
                this.pm.currentProjectId = project.id;
                console.log(`Switched to project: ${project.name}`);
                // later -> re-render tasks for this project
            });

            projectContainer.appendChild(btn);
        });
    }

    renderTasks() {
        const project = this.pm.getProject(this.currentProjectId);
        
    }

    // render tools

}