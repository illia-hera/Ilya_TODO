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

export default Task;