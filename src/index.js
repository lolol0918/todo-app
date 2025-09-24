import "./style/style.css";
import { ProjectManager } from "./modules/projectManager";
import { UI } from "./modules/ui.js";

const createProjectBtn = document.getElementById("create-project");
const addTaskBtn = document.getElementById("add-task-btn");


const pm = new ProjectManager();
window.pm = pm; // temporary just ot test
pm.addProject("wao", "none");

const ui = new UI(pm);
ui.init();

createProjectBtn.addEventListener('click', () => ui.renderProjectForm());
addTaskBtn.addEventListener("click", () => {
    pm.currentProjectId
        ? ui.renderForm() // opens prompts + creates the task
        : alert("Please select a project first!");
});