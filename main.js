class TodoApp {
  execute() {
    const store = new Store();

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

  init() {
    const tasks = this._taskManager.getTasks();
    tasks.forEach(task => {
      this._render.renderTask(task);
    });
  }

  deleteAll() {
    this._taskManager.getTasks()
      .forEach(task => {
        this._render.renderTask(this._taskManager.removeTask(task));
      });
  }

  updateAll() {
    this._taskManager.getTasks()
      .forEach(task => {
        this._render.renderTask(this._taskManager.updateTask(task));
      });
  }

  addTask(title) {
    const task = this._taskManager.createTask(title);
    this._render.renderTask(task);
  }
}


class TaskManager {
  constructor(store) {
    if (!(store instanceof AbstractStore)) {
      throw new Error('stor should implements AbstractStore interface')
    }
    this._store = store;
  }

  getTasks() {
    return this._store.getTasks();
  }
  createTask(title) {
    const id = Math.random().toString(36).substr(2, 16);
    const task = new Task(id, title);
    return this._store.saveTask(task);
  }

  removeTask(task) {
    return this._store.removeTask(task)
  }

  updateTask(task) {
    task.toggle();
    return this._store.updateTask(task);
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

  getTask(id) {
    const task = this._store.find(task => task.id === id)

    if (!task) {
      throw new Error(`there is no task with id = ${id}`)
    }
    let taskCopy = null;
    try {
      taskCopy = Task.fromJSON(Task.toJSON(task));
    } catch (error) {
      throw new Error(`inpossible get task with id = ${id}`, error.message)
    }

    return taskCopy;
  }

  getTasks() {
    return this._store
      .map(task => {
        let taskCopy = null;
        try {
          taskCopy = Task.fromJSON(Task.toJSON(task));
        } catch (error) {
          throw new Error(`inpossible get task with id = ${id}`, error.message);
        }
        return taskCopy;
      });
  }

  updateTask(newTask) {
    this.removeTask(this.getTask(newTask.id))
    return this.saveTask(newTask)
  }

  getTaskIndexInStore(task) {
    const index = this._store
    .indexOf(this._store.find(
      taskInStore => {
        if (task.id === taskInStore.id){
          return taskInStore
        }
    }))
    return index;
  }

  removeTask(task) {
    // delete this._store[this.getTaskIndex(task)];
    this._store.splice(this.getTaskIndexInStore(task), 1);
    return `Task with title: '${task.title}' was deleted`;
  }

  saveTask(task) {
    this._store.push(task);
    return task;
  }

};

class StoreLS extends AbstractStore {
  constructor() {
    super();
    this.prefix = 'strLS'
  }

  getTask(id) {
    const key = `${this.prefix}${id}`;
    const taskJson = localStorage.getItem(key);
    if (!taskJson) {
      throw new Error(`there is no task with id = ${id}`)
    }

    let task = null

    try {
      task = Task.fromJSON(taskJson);
    } catch (error) {
      throw new Error(`inpossible get task with id = ${id}`, error.message)
    }

    return task;
  }

  getTasks() {
    const tasks = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key.includes(this.prefix)) {
        let task = null

        try {
          task = Task.fromJSON(localStorage.getItem(key));
        } catch (error) {
          throw new Error(`inpossible get task with id = ${id}`, error.message)
        }
        tasks.push(task);
      }
    }
    return tasks;
  }

  saveTask(task) {
    const key = `${this.prefix}${task.id}`;
    const json = Task.toJSON(task);
    localStorage.setItem(key, json);

    let taskCopy = null

    try {
      taskCopy = Task.fromJSON(localStorage.getItem(key));
    } catch (error) {
      throw new Error(`inpossible get task with id = ${id}`, error.message)
    }

    return taskCopy;
  }

  updateTask(newTask) {
    this.removeTask(this.getTask(newTask.id))
    return this.saveTask(newTask)
  }

  removeTask(task) {
    localStorage.removeItem(`${this.prefix}${task.id}`);
    return `Task with title: '${task.title}' was deleted`
  }
}



const app = new TodoApp();
app.execute();