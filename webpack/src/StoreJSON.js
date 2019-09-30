import AbstractStore from './AbstractStore.js';

class StoreJSON extends AbstractStore {
    constructor() {
      super();
      this._headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Method': 'GET, POST, PUT, DELETE, PATCH'
      }
    }
  
    async saveTask(task) {
      const response = await fetch(
        `http://localhost:3000/tasks`, {
          headers: this._headers,
          method: 'POST',
          body: Task.toJSON(task)
        }
      );
  
      return Promise.resolve(response.json());
    }
  
    async getTask(id) {
      const response = await fetch(`http://localhost:3000/tasks/${id}`);
      return Promise.resolve(Task.fromJSON(await resp.text(response.json())));
    }
  
    async getTasks() {
      const response = await fetch('http://localhost:3000/tasks');
      const tasks = [];
      let tasksArr = await response.json();
      tasksArr.forEach(taskProto => {
          tasks.push(Task.fromJSON(JSON.stringify(taskProto)))
      })
  
      return Promise.resolve(tasks);
    };
  
    async removeTask(task) {
      const response = await fetch(
        `http://localhost:3000/tasks/${task.id}`, {
          headers: this._headers,
          method: 'DELETE'
        }
      );
  
      return Promise.resolve(response.json());
    }
  
    async updateTask(task) {
      const response = await fetch(
        `http://localhost:3000/tasks/${task.id}`, {
          headers: this._headers,
          method: 'PUT',
          body: Task.toJSON(task)
        }
      );
  
      return Promise.resolve(response.json());
    }
  }
  

  export default StoreJSON;