import AbstractStore from './AbstractStore.js';


class Store extends AbstractStore {
    constructor() {
      super();
      this._store = [];
    }
  
    async getTask(id) {
      const task = this._store.find(task => task.id === id)
      if (!task) {
        return Promise.reject(new Error(`there is no task with id = ${id}`))
      }
  
      return  Promise.resolve(task.copy());
    }
  
    async getTasks() {
      return Promise.resolve(this._store
        .map(task => {
          return task.copy();
        }));
    }
  
    async updateTask(newTask) {
      await this.removeTask(await this.getTask(newTask.id));
      return Promise.resolve(this.saveTask(newTask));
    }
  
    removeTask(task) {
      this._store = this._store.filter(storeTask => storeTask.id !== task.id)
      return Promise.resolve(`Task with title: '${task.title}' was deleted`);
    }
  
    saveTask(task) {
      this._store.push(task);
      return Promise.resolve(task.copy());
    }
  };

  export default Store;