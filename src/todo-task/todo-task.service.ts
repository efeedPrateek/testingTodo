import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TodoTask, TodoTaskDocument } from './todo.schema';
import { Model } from 'mongoose';

@Injectable()
export class TodoTaskService {
  constructor(
    @InjectModel(TodoTask.name)
    private readonly TodoTaskModel: Model<TodoTaskDocument>,
  ) {}

  async create(payload, userId) {
    try {
      const createTask = await this.TodoTaskModel.create({
        ...payload,
        userId: userId,
      });
      if (!createTask) throw new Error('Cannot Add Todo Task!!');
      return createTask;
    } catch (err) {
      return err;
    }
  }

  async find(filter, userId) {
    try {
      const findTask = await this.TodoTaskModel.find({
        $and: [{ filter }, { userId: userId }],
      }).sort({ _id: -1 });
      if (!findTask.length)
        throw new Error('No Todo Task Found for this User!!');
      return findTask;
    } catch (err) {
      return err;
    }
  }

  async deleteTask(taskId, userId) {
    try {
      const deleteTask = await this.TodoTaskModel.findOneAndDelete({
        _id: taskId,
        userId: userId,
      });
      if (!deleteTask) throw new Error('Cannot Delete Todo Task!!');
      return deleteTask;
    } catch (err) {
      return err;
    }
  }

  async updateTask(filter, userId) {
    try {
      const update = await this.TodoTaskModel.findOneAndUpdate(
        { _id: filter.taskId, userId: userId },
        { filter },
        { new: true },
      );
      if (!update) throw new Error('Cannot Update Todo Task!!');
      return update;
    } catch (err) {
      return err;
    }
  }
}
