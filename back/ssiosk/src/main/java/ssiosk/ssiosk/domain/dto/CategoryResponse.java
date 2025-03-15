package ssiosk.ssiosk.domain.dto;

import lombok.Builder;
import lombok.Getter;
import ssiosk.ssiosk.domain.entity.CategoryEntity;

@Getter
public class CategoryResponse {
    private Integer id;
    private String name;

    @Builder
    public CategoryResponse(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public static CategoryResponse toDTO(CategoryEntity categoryEntity) {
        return CategoryResponse
                .builder()
                .id(categoryEntity.getId())
                .name(categoryEntity.getName())
                .build();
    }
}
