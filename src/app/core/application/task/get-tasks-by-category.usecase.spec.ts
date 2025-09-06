import { GetTasksByCategoryUseCase } from './get-tasks-by-category.usecase';
import { TodoTask } from '../../domain/entities/task';
import { TaskRepository } from '../../domain/repositories/task-respositories';

describe('GetTasksByCategoryUseCase', () => {
  let useCase: GetTasksByCategoryUseCase;
  let mockTaskRepo: jasmine.SpyObj<TaskRepository>;

  beforeEach(() => {
    mockTaskRepo = jasmine.createSpyObj('TaskRepository', ['getTasks']);
    useCase = new GetTasksByCategoryUseCase(mockTaskRepo);
  });

  it('should call repository.getTasks and return tasks for category', async () => {
    const mockTasks: TodoTask[] = [
      { title: 'Task1', completed: false },
      { title: 'Task2', completed: true },
    ];
    mockTaskRepo.getTasks.and.resolveTo(mockTasks);

    const result = await useCase.execute('cat1');

    expect(mockTaskRepo.getTasks).toHaveBeenCalledWith('cat1');
    expect(result).toEqual(mockTasks);
  });
});
