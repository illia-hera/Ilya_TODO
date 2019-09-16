class TodoApp {
  execute() {
    const store = new StoreJSON();

    const taskManager = new TaskManager(store);
    const render = new Render();
    const toDo = new TODO(taskManager, render);
    const titleInputRef = document.getElementById("task-title");
    const createTaskBtnRef = document.getElementById("task-create-button");
    const debugBtnRef = document.getElementById("task-debug-button");
    const delBtnRef = document.getElementById("task-deleteAll-button");
    const toggleAllBtnRef = document.getElementById("task-toggleAll-button");

    createTaskBtnRef.addEventListener('click', () => {
      toDo.addTask(titleInputRef.value);
    });

    debugBtnRef.addEventListener('click', () => {
      toDo.init();
    });

    delBtnRef.addEventListener('click', () => {
      toDo.deleteAll();
    });

    toggleAllBtnRef.addEventListener('click', () => {
      toDo.updateAll();
    });
  }
}


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



class Task {
  constructor(id,
    title,
    isDone = false,
    creationMoment = Date.now()
  ) {
    this._id = id;
    this._title = title;
    this._isDone = isDone;
    this._creationMoment = creationMoment;
  }

  get id() {
    return this._id
  }
  get title() {
    return this._title
  }
  get isDone() {
    return this._isDone
  }
  get creationMoment() {
    return this._creationMoment
  }

  toggle() {
    return this._isDone = !this._isDone
  }

  static toJSON(task) {
    return JSON.stringify({
      id: task.id,
      title: task.title,
      isDone: task.isDone,
      creationMoment: task.creationMoment
    })
  }

  static fromJSON(json) {
    let obj = null;
    try {
      obj = JSON.parse(json);
    } catch (error) {
      throw new Error(`invalid json: ${json}`, error.message);
    }

    return new Task(
      obj.id,
      obj.title,
      obj.isDone,
      obj.creationMoment
    );
  }

  copy() {
    return new Task(
      this.id,
      this.title,
      this.isDone,
      this.creationMoment
    )

  }
}



class Render {
  renderTask(task) {
    console.log(task);
  }
  clear() {
    console.clear();
  }
}



class AbstractStore {
  getTasks() {
    throw new Error('not implemented')
  }
  saveTasks(task) {
    throw new Error('not implemented')
  }
}



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

const app = new TodoApp();
app.execute();