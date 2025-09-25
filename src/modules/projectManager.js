import { Project } from "./project.js";

export class ProjectManager {
    constructor() {
        // localStorage management
        const stored = localStorage.getItem("projects");
        
        // if there is data stored it load that data else it is an empty array
        // if storage exists, rebuild Projects properly
        this.projects = stored
            ? JSON.parse(stored).map(p => Object.assign(new Project(p.name, p.description), p))
            : [];

        // added this to make the UI easier
        this.currentProjectId = null;
    }

    // add project
    addProject(name, description = "") {
        const project = new Project(name, description);
        this.projects.push(project);
        if (!this.currentProjectId) this.currentProjectId = project.id;

        this.saveToStorage();

        return project;
    }

    // delete project
    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.currentProjectId === projectId) {
            this.currentProjectId = this.projects.length > 0 ? this.projects[0].id : null;
        }

        this.saveToStorage();
    }

    // get  project
    getProject(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    // add todo to project
    addTodoToProject(projectId, todo) {
        const project = this.getProject(projectId);
        if (project) project.addTodo(todo); // uses Project class' addTodo method

        this.saveToStorage();
    }

    // just mirrored addTodoToProject for deletion
    removeTodoFromProject(projectId, todoId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            project.removeTodo(todoId);
        }

        this.saveToStorage();
    }

    // saves projects made into local storage
    // this will be called in methods that adds or delete projects and tasks of the methods in this class
    saveToStorage() {
        localStorage.setItem("projects", JSON.stringify(this.projects));
    }
}