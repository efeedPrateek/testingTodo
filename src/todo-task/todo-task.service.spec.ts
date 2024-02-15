import { Test, TestingModule } from '@nestjs/testing';
import { TodoTaskService } from './todo-task.service';

describe('TodoTaskService', () => {
  let service: TodoTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoTaskService],
    }).compile();

    service = module.get<TodoTaskService>(TodoTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
