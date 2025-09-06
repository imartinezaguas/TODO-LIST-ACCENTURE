import { TestBed } from '@angular/core/testing';
import { StorageTaskRepository } from './storage-task.repository';
import { StorageService } from '../services/storage.service';
import { Category } from '../../domain/entities/category';
import { TodoTask } from '../../domain/entities/task';
import { CATEGORY_KEY } from '../../presentation/constants/const';

describe('StorageTaskRepository', () => {
  let repository: StorageTaskRepository;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockCategories: Category[] = [
    { id: '1', title: 'Trabajo', tasks: [{ title: 'tarea1', completed: false }], color: 'red', icon: 'briefcase', completed: 0 },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [
        StorageTaskRepository,
        { provide: StorageService, useValue: spy },
      ],
    });

    repository = TestBed.inject(StorageTaskRepository);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should get tasks by category id', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));

    const tasks = await repository.getTasks('1');
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('tarea1');
  });

  it('should add a task to a category', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));
    storageServiceSpy.set.and.returnValue(Promise.resolve());

    const result = await repository.addTask('1', 'nueva tarea');
    expect(result.length).toBe(2);
    expect(storageServiceSpy.set).toHaveBeenCalledWith(CATEGORY_KEY, jasmine.any(Array));
  });

  it('should toggle a task', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));
    storageServiceSpy.set.and.returnValue(Promise.resolve());

    const result = await repository.toggleTask('1', mockCategories[0].tasks[0]);
    expect(result[0].completed).toBeTrue();
  });

  it('should delete a task by index', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));
    storageServiceSpy.set.and.returnValue(Promise.resolve());

    const result = await repository.deleteTask('1', 0);
    expect(result.length).toBe(0);
  });
});
