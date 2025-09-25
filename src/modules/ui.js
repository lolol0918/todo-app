import { Todo } from "./todo.js";

export class UI {
    constructor(projectManager) {
        this.pm = projectManager;
    }

    // bind all using init()
    init() {
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

            projectBtn.addEventListener("click", (e) => {
                // remove active from all buttons
                document.querySelectorAll(".project-btn").forEach(b => b.classList.remove("active"));

                // add active to the clicked one
                e.currentTarget.classList.add("active");

                // switch project
                this.pm.currentProjectId = project.id;
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
                this.clearTasks();

            });

            wrapper.appendChild(projectBtn);
            wrapper.appendChild(deleteBtn);

            projectContainer.appendChild(wrapper);
        });

        // remove active class from all buttons
        document.querySelectorAll(".project-btn").forEach(b => b.classList.remove("active"));

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
                        <button class="todo-button edit-btn">Edit</button>
                        <button class="todo-button danger delete-btn">Delete</button>
                        </div>
                    </div>
                    `;
            div.innerHTML = card;

            taskContainer.appendChild(div);

            const deleteBtn = div.querySelector(".delete-btn");
            const editBtn = div.querySelector(".edit-btn");

            deleteBtn.addEventListener("click", () => {
                this.pm.removeTodoFromProject(this.pm.currentProjectId, todo.id);
                this.renderTasks();
            });

            editBtn.addEventListener("click", () => {
                this.renderEditTodoForm(todo); // no immediate re-render
            });
        });
    }

    clearTasks() {
        const div = document.getElementById("task-container");
        div.innerHTML = ``;
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
                    <div class="form-group">
                        <label class="form-label" for="todoTitle">Title</label>
                        <input
                            type="text"
                            id="todoTitle"
                            class="form-input"
                            placeholder="Enter todo title..."
                            required
                        >
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="todoDescription">Description</label>
                        <textarea id="todoDescription" class="form-textarea" placeholder="Enter detailed description..."></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="todoDueDate">Due Date</label>
                        <input
                            type="date"
                            id="todoDueDate"
                            class="form-input"
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

        const today = new Date().toISOString().split("T")[0];
        div.querySelector("#todoDueDate").value = today;

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

    renderProjectForm() {
        const body = document.body;

        // modal wrapper
        const div = document.createElement("div");
        div.classList.add("modal");

        // project form modal content
        div.innerHTML = `
        <div class="form-container">
            <div class="form-header">
                <h2 class="form-title">Create New Project</h2>
                <button type="button" class="modal-close">&times;</button>
                <p class="form-subtitle">Enter details to create a new project</p>
            </div>
            <form class="project-form" action="#" method="post">
                <div class="form-group">
                    <label class="form-label" for="projectName">Name</label>
                    <input
                        type="text"
                        id="projectName"
                        class="form-input"
                        placeholder="Enter project name..."
                        required
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="projectDescription">Description</label>
                    <textarea
                        id="projectDescription"
                        class="form-textarea"
                        placeholder="Enter project description..."
                    ></textarea>
                </div>
                <div class="form-actions">
                    <button type="reset" class="form-button">Reset</button>
                    <button type="submit" class="form-button primary">Create Project</button>
                </div>
            </form>
        </div>
    `;

        body.appendChild(div);

        // close + form events
        const closeBtn = div.querySelector(".modal-close");
        const form = div.querySelector(".project-form");

        closeBtn.addEventListener("click", () => div.remove());

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = div.querySelector("#projectName").value;
            const description = div.querySelector("#projectDescription").value;

            this.pm.addProject(name, description); // use your ProjectManager
            this.renderProjects();

            div.remove(); // close modal after submit
        });
    }

    renderEditTodoForm(todo) {
        const body = document.body;

        const div = document.createElement("div");
        div.classList.add("modal");

        div.innerHTML = `
        <div class="form-container">
            <div class="form-header">
                <h2 class="form-title">Edit Todo</h2>
                <button type="button" class="modal-close">&times;</button>
                <p class="form-subtitle">Update your task details</p>
            </div>
            <form class="todo-form" action="#" method="post">
                <div class="form-group">
                    <label class="form-label" for="todoTitle">Title</label>
                    <input
                        type="text"
                        id="todoTitle"
                        class="form-input"
                        value="${todo.title}"
                        required
                    >
                </div>
                <div class="form-group">
                    <label class="form-label" for="todoDescription">Description</label>
                    <textarea id="todoDescription" class="form-textarea">${todo.description}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="todoDueDate">Due Date</label>
                    <input
                        type="date"
                        id="todoDueDate"
                        class="form-input"
                        value="${todo.dueDate}"
                    >
                </div>
                <div class="form-group">
                    <label class="form-label">Priority</label>
                    <div class="form-priority-options">
                        <label class="priority-option">
                            <input type="radio" name="priority" value="normal" ${todo.priority === "normal" ? "checked" : ""}>
                            <span>Normal</span>
                        </label>
                        <label class="priority-option">
                            <input type="radio" name="priority" value="high" ${todo.priority === "high" ? "checked" : ""}>
                            <span>High</span>
                        </label>
                        <label class="priority-option">
                            <input type="radio" name="priority" value="urgent" ${todo.priority === "urgent" ? "checked" : ""}>
                            <span>Urgent</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Completed</label>
                    <div class="form-checkbox-group">
                        <input type="checkbox" id="todoCompleted" class="form-checkbox" ${todo.completed ? "checked" : ""}>
                        <span>Mark as completed</span>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="form-button primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;

        body.appendChild(div);

        // handle submit
        const form = div.querySelector(".todo-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // update fields from form
            todo.title = form.querySelector("#todoTitle").value.trim();
            todo.description = form.querySelector("#todoDescription").value.trim();
            todo.dueDate = form.querySelector("#todoDueDate").value;
            todo.priority = form.querySelector("input[name='priority']:checked").value;
            todo.completed = form.querySelector("#todoCompleted").checked;

            // re-render your task list
            this.renderTasks();

            // close modal
            body.removeChild(div);
        });

        // close modal with ×
        div.querySelector(".modal-close").addEventListener("click", () => {
            body.removeChild(div);
        });
    }
}