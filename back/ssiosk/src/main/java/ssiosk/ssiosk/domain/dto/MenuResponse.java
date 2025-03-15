package ssiosk.ssiosk.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import ssiosk.ssiosk.domain.entity.MenuEntity;


@Getter
public class MenuResponse {
    private Integer id;
    private String name;
    private String description;
    private Integer categoryId;
    private Integer price;
    private String imageUrl;

    @Builder
    public MenuResponse(@NonNull Integer id,
                        @NonNull String name,
                        String description,
                        Integer categoryId,
                        @NonNull Integer price,
                        String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public static MenuResponse toDTO(MenuEntity menuEntity) {
        return MenuResponse
                .builder()
                .id(menuEntity.getId())
                .name(menuEntity.getName())
                .description(menuEntity.getDescription())
                .price(menuEntity.getPrice())
                .imageUrl(menuEntity.getImageUrl())
                .build();
    }

    public void updateCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }
}

