import "./style/style.css";
import { ProjectManager } from "./modules/projectManager";
import { UI } from "./modules/ui.js";

const createProjectBtn = document.getElementById("create-project");


const pm = new ProjectManager();
pm.addProject("wao", "none");

const ui = new UI(pm);


createProjectBtn.addEventListener('click', () => ui.createProject());