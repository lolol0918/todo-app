export class Project {
    constructor (name, description = "") {
        this.id = crypto.randomUUID();
        this.name = name;
        this.description = description;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(t => t.id !== todoId);
    }

    getTodos() {
        return this.todos;
    }
}