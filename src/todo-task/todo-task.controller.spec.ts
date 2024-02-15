import { Test, TestingModule } from '@nestjs/testing';
import { TodoTaskController } from './todo-task.controller';

describe('TodoTaskController', () => {
  let controller: TodoTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoTaskController],
    }).compile();

    controller = module.get<TodoTaskController>(TodoTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
