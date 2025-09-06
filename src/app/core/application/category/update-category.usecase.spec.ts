import { TestBed } from '@angular/core/testing';
import { UpdateCategoryUseCase } from './update-category.usecase';
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from '../../domain/repositories/category-repositories';
import { Category } from '../../domain/entities/category';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let mockRepo: jasmine.SpyObj<CategoryRepository>;

  beforeEach(() => {
    const repoSpy = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['update']);

    TestBed.configureTestingModule({
      providers: [
        UpdateCategoryUseCase,
        { provide: CATEGORY_REPOSITORY_TOKEN, useValue: repoSpy }
      ],
    });

    useCase = TestBed.inject(UpdateCategoryUseCase);
    mockRepo = TestBed.inject(CATEGORY_REPOSITORY_TOKEN) as jasmine.SpyObj<CategoryRepository>;
  });

  it('debería actualizar una categoría en el repositorio', async () => {
    const category: Category = {
      id: '1',
      title: 'Casa',
      tasks: [],
      completed: 0,
      total: 0,
      color: 'success',
      icon: 'home-outline',
    };

    mockRepo.update.and.resolveTo();

    await useCase.execute(category);

    expect(mockRepo.update).toHaveBeenCalledWith(category);
  });
});
