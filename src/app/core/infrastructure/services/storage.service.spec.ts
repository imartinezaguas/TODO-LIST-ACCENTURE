import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './storage.service';
import { TodoTask } from '../../domain/entities/task';

describe('StorageService', () => {
  let service: StorageService;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);

    await TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: spy }
      ]
    }).compileComponents();

    service = TestBed.inject(StorageService);
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;

    // simulamos que storage.create() devuelve un objeto con los mismos métodos
    storageSpy.create.and.resolveTo(storageSpy);
  });

  it('should initialize storage on first call', async () => {
    storageSpy.get.and.resolveTo('value');
    const result = await service.get('key1');

    expect(storageSpy.create).toHaveBeenCalled();
    expect(result).toBe('value');
  });

  it('should set a value in storage', async () => {
    storageSpy.set.and.resolveTo();

    await service.set('key2', 'myValue');
    expect(storageSpy.set).toHaveBeenCalledWith('key2', 'myValue');
  });

  it('should get a value from storage', async () => {
    storageSpy.get.and.resolveTo('storedValue');

    const result = await service.get('key3');
    expect(result).toBe('storedValue');
    expect(storageSpy.get).toHaveBeenCalledWith('key3');
  });

  it('should update tasks list in storage', async () => {
    const tasks: TodoTask[] = [
      { title: 'Task1', completed: false },
      { title: 'Task2', completed: true }
    ];

    storageSpy.set.and.resolveTo();

    await service.updateTasks('category1', tasks);
    expect(storageSpy.set).toHaveBeenCalledWith('category1', tasks);
  });
});
