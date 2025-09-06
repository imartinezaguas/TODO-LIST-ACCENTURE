import { TestBed } from '@angular/core/testing';
import { GetCategoriesUseCase } from './get-categories.usecase';
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from '../../domain/repositories/category-repositories';
import { Category } from '../../domain/entities/category';

describe('GetCategoriesUseCase', () => {
  let useCase: GetCategoriesUseCase;
  let mockRepo: jasmine.SpyObj<CategoryRepository>;

  beforeEach(() => {
    const repoSpy = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        GetCategoriesUseCase,
        { provide: CATEGORY_REPOSITORY_TOKEN, useValue: repoSpy }
      ],
    });

    useCase = TestBed.inject(GetCategoriesUseCase);
    mockRepo = TestBed.inject(CATEGORY_REPOSITORY_TOKEN) as jasmine.SpyObj<CategoryRepository>;
  });

  it('debería devolver las categorías del repositorio', async () => {
    const categories: Category[] = [
      { id: '1', title: 'Trabajo', tasks: [], completed: 0, total: 0, color: 'primary', icon: 'briefcase-outline' },
      { id: '2', title: 'Casa', tasks: [], completed: 0, total: 0, color: 'success', icon: 'home-outline' },
    ];

    mockRepo.getAll.and.resolveTo(categories);

    const result = await useCase.execute();

    expect(result).toEqual(categories);
    expect(mockRepo.getAll).toHaveBeenCalled();
  });
});
