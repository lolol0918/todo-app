import { Todo } from "./todo.js";

export class UI {
    constructor(projectManager) {
        this.pm = projectManager;
    }

    // bind all using init()
    init() {
        this.renderProjects();
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
        taskContainer.innerHTML = ``;

        project.todos.forEach(todo => {
            const div = document.createElement("div");
            div.classList.add("task");

            const card = `
                    <div class="todo-card">
                        <div class="todo-header">
                        <label style="display: flex; align-items: center; cursor: pointer; margin: 0; font-size: var(--font-size-base);">
                            <input type="checkbox" class="todo-checkbox">
                            <h2 class="todo-title">${todo.title}</h2>
                        </label>
                        <span class="todo-priority ${todo.priority} todo-priority-badge">${todo.priority}</span>
                        </div>
                        <p class="todo-description">${todo.description}</p>
                        <div class="todo-due-date">
                        <span class="date-icon">📅</span>
                        Due: ${todo.dueDate}
                        </div>
                        <div class="todo-actions">
                        <button class="todo-button">Edit</button>
                        <button class="todo-button danger">Delete</button>
                        </div>
                    </div>
                    `;
            div.innerHTML = card;

            taskContainer.appendChild(div);
        })
    }

    renderForm() {
        // body
        const body = document.body;

        // create a div with modal class
        const div = document.createElement("div");
        div.classList.add("modal");

        // append the html to that modal
        div.innerHTML = `
            <div class="form-container">
                <div class="form-header">
                    <h2 class="form-title">Create New Todo</h2>
                    <button type="button" class="modal-close">&times;</button>
                    <p class="form-subtitle">Fill in the details to generate a todo item</p>
                </div>
                <form class="todo-form" action="#" method="post">
                    <!-- Static form; use JS or backend for submission -->
                    <div class="form-group">
                        <label class="form-label" for="todoTitle">Title</label>
                        <input
                            type="text"
                            id="todoTitle"
                            class="form-input"
                            placeholder="Enter todo title..."
                            required
                            value="Complete project proposal"
                        >
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="todoDescription">Description</label>
                        <textarea id="todoDescription" class="form-textarea" placeholder="Enter detailed description...">Write the initial draft and gather feedback from the team before submission.</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="todoDueDate">Due Date</label>
                        <input
                            type="date"
                            id="todoDueDate"
                            class="form-input"
                            value="2023-12-15"
                        >
                    </div>
                    <div class="form-group">
                        <label class="form-label">Priority</label>
                        <div class="form-priority-options">
                            <label class="priority-option">
                                <input
                                    type="radio"
                                    name="priority"
                                    value="normal"
                                    checked
                                >
                                <span>Normal</span>
                            </label>
                            <label class="priority-option">
                                <input type="radio" name="priority" value="high">
                                <span>High</span>
                            </label>
                            <label class="priority-option">
                                <input type="radio" name="priority" value="urgent">
                                <span>Urgent</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Completed</label>
                        <div class="form-checkbox-group">
                            <input type="checkbox" id="todoCompleted" class="form-checkbox">
                            <span>Mark as completed</span>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="reset" class="form-button">Reset</button>
                        <button type="submit" class="form-button primary">Create Todo</button>
                    </div>
                </form>
            </div>
        `

        // append modal to the body

        body.appendChild(div);

        // grab close button + form
        const closeBtn = div.querySelector(".modal-close");
        const form = div.querySelector(".todo-form");

        // close modal event
        closeBtn.addEventListener("click", () => {
            div.remove();
        });

        // submit form event
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const title = div.querySelector("#todoTitle").value;
            const description = div.querySelector("#todoDescription").value;
            const dueDate = div.querySelector("#todoDueDate").value;
            const priority = div.querySelector("input[name='priority']:checked").value;
            const completed = div.querySelector("#todoCompleted").checked;

            const todo = new Todo(title, description, dueDate, priority, completed);

            this.pm.addTodoToProject(this.pm.currentProjectId, todo);
            this.renderTasks();

            div.remove(); // close modal after submit
        });
    }
}