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


export default TodoApp;