import { TestBed } from '@angular/core/testing';
import { StorageCategoryRepository } from './storage-category.repository';
import { StorageService } from '../services/storage.service';
import { Category } from '../../domain/entities/category';
import { CATEGORY_KEY } from '../../presentation/constants/const';

describe('StorageCategoryRepository', () => {
  let repository: StorageCategoryRepository;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  const mockCategories: Category[] = [
    { id: '1', title: 'Trabajo', tasks: [], color: 'red', icon: 'briefcase', completed: 0 },
    { id: '2', title: 'Casa', tasks: [], color: 'blue', icon: 'home', completed: 0 },
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [
        StorageCategoryRepository,
        { provide: StorageService, useValue: spy },
      ],
    });

    repository = TestBed.inject(StorageCategoryRepository);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should return categories when getAll is called', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));

    const result = await repository.getAll();
    expect(result.length).toBe(2);
    expect(storageServiceSpy.get).toHaveBeenCalledWith(CATEGORY_KEY);
  });

  it('should add a category', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve([]));
    storageServiceSpy.set.and.returnValue(Promise.resolve());

    const newCategory: Category = { id: '3', title: 'Gym', tasks: [], color: 'green', icon: 'fitness', completed: 0 };
    await repository.add(newCategory);

    expect(storageServiceSpy.set).toHaveBeenCalledWith(CATEGORY_KEY, [newCategory]);
  });

  it('should update a category', async () => {
    const updatedCategory: Category = { ...mockCategories[0], title: 'Trabajo actualizado' };

    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));
    storageServiceSpy.set.and.returnValue(Promise.resolve());

    await repository.update(updatedCategory);

    expect(storageServiceSpy.set).toHaveBeenCalled();
    const saved = storageServiceSpy.set.calls.mostRecent().args[1] as Category[];
    expect(saved[0].title).toBe('Trabajo actualizado');
  });

  it('should delete a category by id', async () => {
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockCategories));
    storageServiceSpy.set.and.returnValue(Promise.resolve());

    await repository.delete('1');

    expect(storageServiceSpy.set).toHaveBeenCalled();
    const saved = storageServiceSpy.set.calls.mostRecent().args[1] as Category[];
    expect(saved.find(c => c.id === '1')).toBeUndefined();
  });
});
