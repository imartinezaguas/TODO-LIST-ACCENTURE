import { ToggleTaskUseCase } from './toggle-task.usecase';
import { TodoTask } from '../../domain/entities/task';
import { TaskRepository } from '../../domain/repositories/task-respositories';

describe('ToggleTaskUseCase', () => {
  let useCase: ToggleTaskUseCase;
  let mockTaskRepo: jasmine.SpyObj<TaskRepository>;

  beforeEach(() => {
    mockTaskRepo = jasmine.createSpyObj('TaskRepository', ['toggleTask']);
    useCase = new ToggleTaskUseCase(mockTaskRepo);
  });

  it('should call repository.toggleTask and return updated tasks', async () => {
    const task: TodoTask = { title: 'Test', completed: false };
    const updatedTasks: TodoTask[] = [{ title: 'Test', completed: true }];
    mockTaskRepo.toggleTask.and.resolveTo(updatedTasks);

    const result = await useCase.execute('cat1', task);

    expect(mockTaskRepo.toggleTask).toHaveBeenCalledWith('cat1', task);
    expect(result).toEqual(updatedTasks);
  });
});
