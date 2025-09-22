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
        if(!this.currentProjectId) this.currentProjectId = project.id;
    }
    
    // delete project
    deleteProject(projectId) {
        return this.projects = this.projects.filter(p => p.id !== projectId);
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