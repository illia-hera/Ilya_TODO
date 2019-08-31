class TodoApp {
  dispose(){

  }

  execute() {

  }
}

class TaskManager {
  constructor(task, render, stor){
      this.render = render;
      this.stor = store;
      this.task = task;
  }
  creatTask() {
    this.task = new Task();
  }

  removeTask(id){

  }

  updateTask(id) {
      
  }
}

class Task {
  constructor(title){
      this._id = this.getRandomId();
      this._title = title;
  }
  getRandomId() {
      return `'_${Math.random().toString(36).substr(2, 12)}'`;
  }
  get id () {
    return this._id
  }
  isDone() {
      return false;
  }
  toggle() {

  }
}

class Store {

}

const toDo = new Task();

console.log(toDo.id);
