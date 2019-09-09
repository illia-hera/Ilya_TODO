class TodoApp {
  execute() {
    const store = new Store();
    const taskManager = new TaskManager(store);
    const render = new Render();
    const toDo = new TODO(taskManager, render);
    const titleInputRef = document.getElementById("task-title");
    const createTaskBtnRef = document.getElementById("task-create-button");

    createTaskBtnRef.addEventListener('click', () => {
      toDo.addTask(titleInputRef.value);
    });
  }
}

class TODO{
  constructor(taskManager, render){
    this._taskManager = taskManager;
    this._render = render;
  }

  init(){

  }

  addTask(title){
    const task = this._taskManager.createTask(title);
    this._render.renderTask(task);
  }
}

class TaskManager {
  constructor(store){
      this._store = store;
  }
  getTasks(){

  }
  createTask(title){
    const id = Math.random().toString(36).substr(2, 16);
    const task = new Task(id, title);
    this._store.saveTask(task);
    return this._store;
  }

}

class Task {
  constructor(id, title){
    this._id = id;
    this._title = title;
    this._isDone = false;
    this._creationMoment = Date.now();
  }

  get id (){
    return this._id
  }
  get title (){
    return this._title
  }
  get isDone (){
    return this._isDone
  }
  get creationMoment (){
    return this._creationMoment
  }
  toggle(){
    this._isDone = !this._isDone;
  }
  static toJSON(task){
    return JSON.stringify({
      id:  task.id,
      title:  task.title,
      isDone:  task.false,
      creationMoment: 
    })
  }
}

class Render {
  renderTask(task){
    console.log(task);
  }
}

class Store {
  constructor(){
    this._store = [];
  }
  getTasks() {

  }
  saveTask (task){
    this._store.push(task);
    return task;
  }
  getTasks
}

const app = new TodoApp();
app.execute();