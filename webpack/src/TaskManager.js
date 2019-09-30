class TaskManager {
    constructor(store) {
        if (!(store instanceof AbstractStore)) {
            throw new Error('stor should implements AbstractStore interface')
        }
        this._store = store;
    }

    async getTasks() {
        return await this._store.getTasks();
    }

    async createTask(title) {
        const id = Math.random().toString(36).substr(2, 16);
        const task = new Task(id, title);
        return await await this._store.saveTask(task);
    }

    async removeTask(task) {
        return await this._store.removeTask(task)
    }

    async updateTask(task) {
        task.toggle();
        return await this._store.updateTask(task);
    };
}

export default TaskManager;