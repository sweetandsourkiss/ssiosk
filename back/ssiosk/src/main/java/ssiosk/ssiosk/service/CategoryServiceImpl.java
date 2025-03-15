package ssiosk.ssiosk.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ssiosk.ssiosk.domain.entity.CategoryEntity;
import ssiosk.ssiosk.domain.dto.CategoryRequest;
import ssiosk.ssiosk.domain.dto.CategoryResponse;
import ssiosk.ssiosk.exception.CustomException;
import ssiosk.ssiosk.exception.ErrorCode;
import ssiosk.ssiosk.repository.CategoryRepository;
import ssiosk.ssiosk.repository.MenuRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;
    private final MenuRepository menuRepository;

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAllCategories() {
        List<CategoryEntity> categoryEntityList = categoryRepository.findAll();
        return categoryEntityList
                .stream()
                .map(CategoryResponse::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse addCategory(CategoryRequest categoryRequest) {
        Optional<CategoryEntity> optionalCategoryEntity = categoryRepository
                .findByName(categoryRequest.getName());

        CategoryEntity categoryEntity;

        //이름이 있는 경우
        if (optionalCategoryEntity.isPresent()) {
            categoryEntity = optionalCategoryEntity.get();

            //이미 삭제된 경우
            if(categoryEntity.getIsDeleted()) {
                categoryEntity.changeIsDeleted();
            }
            //삭제되지 않은 경우
            else {
                throw new CustomException(ErrorCode.DUPLICATED_CATEGORY);
            }
            //이름이 없는 경우
        } else {
            categoryEntity = CategoryEntity
                    .builder()
                    .name(categoryRequest.getName())
                    .build();
        }

        categoryEntity = categoryRepository.save(categoryEntity);
        return CategoryResponse.toDTO(categoryEntity);
    }

    @Transactional(readOnly = true)
    public CategoryResponse findCategoryById(Integer categoryId) {
        CategoryEntity categoryEntity = categoryRepository
                .findByIdAndIsDeletedIsFalse(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));
        return CategoryResponse.toDTO(categoryEntity);
    }

    @Transactional
    public CategoryResponse modifyCategory(Integer categoryId, CategoryRequest categoryRequest) {
        CategoryEntity categoryEntity = categoryRepository
                .findByIdAndIsDeletedIsFalse(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

      categoryRepository.findByNameAndIsDeletedIsFalse(categoryRequest.getName())
                .ifPresent(c -> {
                    throw new CustomException(ErrorCode.DUPLICATED_CATEGORY);
                });

        categoryEntity.updateName(categoryRequest.getName());
        return CategoryResponse.toDTO(categoryEntity);
    }

    @Transactional
    public void deleteCategoryById(Integer categoryId) {
        CategoryEntity categoryEntity = categoryRepository
                .findByIdAndIsDeletedIsFalse(categoryId)
                .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND));

        menuRepository.findAllByCategoryId(categoryId).stream()
                .forEach(menuEntity -> {
                    menuEntity.updateCategory(categoryRepository.findById(1)
                            .orElseThrow(() -> new CustomException(ErrorCode.CATEGORY_NOT_FOUND)));
                    menuRepository.save(menuEntity);
                });

        categoryRepository.delete(categoryEntity);
    }

}
