import { TestBed } from '@angular/core/testing';
import { AddCategoryUseCase } from './add-category.usecase';
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from '../../domain/repositories/category-repositories';
import { Category } from '../../domain/entities/category';

fdescribe('AddCategoryUseCase', () => {
  let useCase: AddCategoryUseCase;
  let mockRepo: jasmine.SpyObj<CategoryRepository>;

  beforeEach(() => {
    // Creamos un mock del repositorio
    const repoSpy = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['add']);

    TestBed.configureTestingModule({
      providers: [
        AddCategoryUseCase,
        { provide: CATEGORY_REPOSITORY_TOKEN, useValue: repoSpy }
      ],
    });

    useCase = TestBed.inject(AddCategoryUseCase);
    mockRepo = TestBed.inject(CATEGORY_REPOSITORY_TOKEN) as jasmine.SpyObj<CategoryRepository>;
  });

  it('debería llamar al repositorio con la categoría', async () => {
    const category: Category = {
      id: '123',
      title: 'Trabajo',
      tasks: [],
      completed: 0,
      total: 0,
      color: 'primary',
      icon: 'briefcase-outline'
    };

    await useCase.execute(category);

    expect(mockRepo.add).toHaveBeenCalledWith(category);
  });
});
