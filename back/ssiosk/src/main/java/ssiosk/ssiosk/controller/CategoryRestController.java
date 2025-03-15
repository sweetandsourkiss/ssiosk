package ssiosk.ssiosk.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ssiosk.ssiosk.domain.dto.CategoryRequest;
import ssiosk.ssiosk.service.CategoryService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@Validated
public class CategoryRestController {

    private final CategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return new ResponseEntity<>(categoryService.findAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/categories/{categoryId}")
    public ResponseEntity<?> getCategory(
            @PathVariable
            @Min(value = 1, message = "카테고리 ID를 1 이상 입력해주세요.")
            @NotNull(message = "카테고리를 입력해주세요.") Integer categoryId) {
        return new ResponseEntity<>(categoryService.findCategoryById(categoryId), HttpStatus.OK);
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody @Valid CategoryRequest categoryRequest) {
        return new ResponseEntity<>(categoryService.addCategory(categoryRequest), HttpStatus.CREATED);
    }

    @PutMapping("/categories/{categoryId}")
    public ResponseEntity<?> modifyCategory(
            @PathVariable
            @Min(value = 1, message = "카테고리 ID를 1 이상 입력해주세요.")
            @NotNull(message = "카테고리를 입력해주세요.")
            Integer categoryId,
            @RequestBody
            @Valid CategoryRequest categoryRequest) {
        return new ResponseEntity<>(categoryService.modifyCategory(categoryId, categoryRequest), HttpStatus.OK);
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<?> deleteCategory(
            @PathVariable
            @Min(value = 1, message = "카테고리 ID를 1 이상 입력해주세요.")
            @NotNull(message = "카테고리를 입력해주세요.") Integer categoryId) {
        categoryService.deleteCategoryById(categoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
