class TODO {
    constructor(taskManager, render) {
        this._taskManager = taskManager;
        this._render = render;
    }

    async init() {
        const tasks = await this._taskManager.getTasks();
        tasks.forEach(task => {
            this._render.renderTask(task);
        });
    }

    async deleteAll() {
        const tasks = await this._taskManager.getTasks();
        tasks.forEach(task => {
            this._taskManager.removeTask(task).then(task => this._render.renderTask(task));
        });
    }

    async updateAll() {
        const tasks = await this._taskManager.getTasks();
        tasks.forEach(task => {
            this._taskManager.updateTask(task).then(task => this._render.renderTask(task));
        });
    }

    async addTask(title) {
        this._render.renderTask(await this._taskManager.createTask(title));
    }
}

export default TODO;