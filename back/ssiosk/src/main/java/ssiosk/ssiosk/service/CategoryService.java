package ssiosk.ssiosk.service;

import org.springframework.stereotype.Service;
import ssiosk.ssiosk.domain.dto.CategoryRequest;
import ssiosk.ssiosk.domain.dto.CategoryResponse;


import java.util.List;


@Service
public interface CategoryService {
    public List<CategoryResponse> findAllCategories();
    public CategoryResponse addCategory(CategoryRequest categoryRequest);

    public CategoryResponse findCategoryById(Integer categoryId);

    public CategoryResponse modifyCategory(Integer categoryId, CategoryRequest categoryRequest);

    public void deleteCategoryById(Integer categoryId);
}
