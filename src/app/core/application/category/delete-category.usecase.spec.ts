import { TestBed } from '@angular/core/testing';
import { DeleteCategoryUseCase } from './delete-category.usecase';
import { CATEGORY_REPOSITORY_TOKEN, CategoryRepository } from '../../domain/repositories/category-repositories';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let mockRepo: jasmine.SpyObj<CategoryRepository>;

  beforeEach(() => {
    const repoSpy = jasmine.createSpyObj<CategoryRepository>('CategoryRepository', ['delete']);

    TestBed.configureTestingModule({
      providers: [
        DeleteCategoryUseCase,
        { provide: CATEGORY_REPOSITORY_TOKEN, useValue: repoSpy }
      ],
    });

    useCase = TestBed.inject(DeleteCategoryUseCase);
    mockRepo = TestBed.inject(CATEGORY_REPOSITORY_TOKEN) as jasmine.SpyObj<CategoryRepository>;
  });

  it('debería eliminar la categoría con el id dado', async () => {
    mockRepo.delete.and.resolveTo();

    await useCase.execute('1');

    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });
});
