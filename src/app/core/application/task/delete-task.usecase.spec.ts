import { AddTaskUseCase } from './add-task.usecase';
import { TodoTask } from '../../domain/entities/task';
import { TaskRepository } from '../../domain/repositories/task-respositories';

describe('AddTaskUseCase', () => {
  let useCase: AddTaskUseCase;
  let mockTaskRepo: jasmine.SpyObj<TaskRepository>;

  beforeEach(() => {
    mockTaskRepo = jasmine.createSpyObj('TaskRepository', ['addTask']);
    useCase = new AddTaskUseCase(mockTaskRepo);
  });

  it('should call repository.addTask and return updated tasks', async () => {
    const mockTasks: TodoTask[] = [{ title: 'Test', completed: false }];
    mockTaskRepo.addTask.and.resolveTo(mockTasks);

    const result = await useCase.execute('cat1', 'Test');

    expect(mockTaskRepo.addTask).toHaveBeenCalledWith('cat1', 'Test');
    expect(result).toEqual(mockTasks);
  });
});
