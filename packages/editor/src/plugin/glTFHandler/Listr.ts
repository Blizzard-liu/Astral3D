/**
 * @author ErSan
 * @email  mlt131220@163.com
 * @date   2024/9/18 22:24
 * @description
 */

export class ListrTask {
    // @ts-ignore
    private title: any;
    private taskFn: any;
    isFailed: boolean;

    constructor(title, taskFn) {
        this.title = title;
        this.taskFn = taskFn;
        this.isFailed = false;
    }

    async run() {
        try {
            await this.taskFn(this);
        } catch (error) {
            this.isFailed = true;

            throw error;
        }
    }
}

export class Listr {
    private tasks: ListrTask[];

    constructor(tasks: { title:string,task:(task: any) => Promise<void> }[]) {
        this.tasks = tasks.map(task => new ListrTask(task.title, task.task));
    }

    async run() {
        for (const task of this.tasks) {
            await task.run();
            if (task.isFailed) {
                break; // 如果任务失败，停止执行后续任务
            }
        }
    }
}