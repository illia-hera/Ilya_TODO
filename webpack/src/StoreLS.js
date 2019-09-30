import AbstractStore from './AbstractStore.js';

class StoreLS extends AbstractStore {
    constructor() {
      super();
      this._prefix = 'strLS'
    }
  
    async getTask(id) {
      const key = `${this._prefix}${id}`;
      const taskJson = localStorage.getItem(key);
      if (!taskJson) {
        return Promise.reject(new Error(`there is no task with id = ${id}`));
      }
      let task = null
  
      try {
        task = Task.fromJSON(taskJson);
      } catch (error) {
        return Promise.reject(new Error(`inpossible get task with id = ${id}`, error.message))
      }
  
      return Promise.resolve(task)
    }
  
    getTasks() {
      const tasks = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
  
        if (key.includes(this._prefix)) {
          let task = null
  
          try {
            task = Task.fromJSON(localStorage.getItem(key));
          } catch (error) {
            return Promise.reject(new Error(`inpossible get task with id = ${id}`, error.message))
          }
          tasks.push(task);
        }
      }
  
      return Promise.resolve(tasks);
    }
  
    saveTask(task) {
      const key = `${this._prefix}${task.id}`;
      const json = Task.toJSON(task);
      localStorage.setItem(key, json);
      let taskCopy = null
  
      try {
        taskCopy = Task.fromJSON(localStorage.getItem(key));
      } catch (error) {
        return Promise.reject(new Error(`inpossible get task with id = ${id}`, error.message))
      }
  
      return Promise.resolve(taskCopy);
    }
  
    async updateTask(newTask) {
      this.removeTask(await this.getTask(newTask.id))
      return Promise.resolve(this.saveTask(newTask));
    }
  
    removeTask(task) {
      localStorage.removeItem(`${this._prefix}${task.id}`);
  
      return Promise.resolve({});
    }
  }


  export default StoreLS;