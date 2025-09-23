import { Project } from "./project.js";

export class ProjectManager {
    constructor() {
        this.projects = [];
        
        // added this to make the UI easier
        this.currentProjectId = null;
    }

    // add project
    addProject(name, description = "") {
        const project = new Project(name, description);
        this.projects.push(project);
        if (!this.currentProjectId) this.currentProjectId = project.id;

        return project;
    }

    // delete project
    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.currentProjectId === projectId) {
            this.currentProjectId = this.projects.length > 0 ? this.projects[0].id : null;
        }
    }

    // get  project
    getProject(projectId) {
        return this.projects.find(p => p.id === projectId);
    }

    // add todo to project
    addTodoToProject(projectId, todo) {
        const project = this.getProject(projectId);
        if (project) project.addTodo(todo); // uses Project class' addTodo method
    }
}