class AbstractStore {
    getTasks() {
        throw new Error('not implemented')
    }
    saveTasks(task) {
        throw new Error('not implemented')
    }
}

export default AbstractStore;